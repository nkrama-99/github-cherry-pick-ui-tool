import { Octokit } from "octokit";

const BRANCH_NAME_RANDOM_NUMBER_LIMIT = 101;

export interface Commit {
  Id: string;
  Message: string;
  ParentSha: string;
}

const instantiateOctokit = (token: string) => {
  return new Octokit({
    auth: token,
  });
};

export async function getCommitsInPR(
  token: string,
  owner: string,
  repo: string,
  prNumber: number
): Promise<Commit[]> {
  const octokit = instantiateOctokit(token);

  const response = await octokit.request(
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/commits",
    {
      owner: owner,
      repo: repo,
      pull_number: prNumber,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  return response.data.map((commitInfo) => {
    return {
      Id: commitInfo.sha,
      Message: commitInfo.commit.message,
      ParentSha: commitInfo.parents[0].sha,
    };
  });
}

export async function getBranchesInRepo(
  token: string,
  owner: string,
  repo: string
): Promise<string[]> {
  const octokit = instantiateOctokit(token);

  // TODO: could have more pages to retrieve from, can get that info from header > links
  const response = await octokit.request("GET /repos/{owner}/{repo}/branches", {
    owner: owner,
    repo: repo,
    per_page: 100,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  return response.data.map((branch) => {
    return branch.name;
  });
}

export async function createCherryPickPR(
  token: string,
  owner: string, // forked repo owner
  repo: string,
  pr: number,
  targetBranch: string,
  commits: Commit[],
  sourceBranch: string,
  prTitle: string,
  mainRepoOwner: string // main repo owner
): Promise<string> {
  try {
    const octokit = instantiateOctokit(token);

    console.log(">>>>>>>>>>>>> START");

    // -- retrieve target branch info
    console.log("STEP 1: Retrieve target branch info");
    const targetBranchBaseCommitSha = await getTargetBranchInfo(
      octokit,
      owner,
      repo,
      targetBranch
    );

    // -- Create a new branch off of target branch
    console.log("STEP 2: Create new branch from target branch");
    const newBranchName =
      sourceBranch +
      "_" +
      targetBranch +
      "_" +
      Math.floor(Math.random() * BRANCH_NAME_RANDOM_NUMBER_LIMIT);
    await createNewBranch(
      octokit,
      owner,
      repo,
      newBranchName,
      targetBranchBaseCommitSha
    );

    // -- start picking
    console.log("STEP 3: Cherry pick all commits");
    for (var index = 0; index < commits.length; index++) {
      await cherryPickCommit(
        commits[index],
        octokit,
        owner,
        repo,
        newBranchName
      );
    }

    // -- create PR
    console.log("STEP 4: Create new PR");
    const urlToPr = await createPrToTargetBranch(
      octokit,
      mainRepoOwner,
      repo,
      prTitle,
      targetBranch,
      pr,
      owner + ":" + newBranchName
    );

    console.log(">>>>>>>>>>>>> COMPLETE");
    return urlToPr;
  } catch (error) {
    console.error("Error fetching commits:", error);
    return "";
  }
}

async function createPrToTargetBranch(
  octokit: Octokit,
  owner: string,
  repo: string,
  prTitle: string,
  targetBranch: string,
  pr: number,
  newBranchName: string
): Promise<string> {
  const res = await octokit.request("POST /repos/{owner}/{repo}/pulls", {
    owner: owner,
    repo: repo,
    title: prTitle + " (merge to " + targetBranch + ")",
    body: "Cherry-picked from #" + pr,
    head: newBranchName,
    base: targetBranch,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  return res.data.html_url;
}

async function cherryPickCommit(
  commit: Commit,
  octokit: Octokit,
  owner: string,
  repo: string,
  newBranchName: string
) {
  // -- get branch info
  console.log("STEP 3A: ", commit.Id.slice(0, 6));
  const newBranchInfo = await octokit.request(
    "GET /repos/{owner}/{repo}/branches/{branch}",
    {
      owner: owner,
      repo: repo,
      branch: newBranchName,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  // -- create temp commit
  console.log("STEP 3B: ", commit.Id.slice(0, 6));
  const tempCommit = await octokit.request(
    "POST /repos/{owner}/{repo}/git/commits",
    {
      owner: owner,
      repo: repo,
      tree: newBranchInfo.data.commit.commit.tree.sha,
      message: "TEMP" + commit.Message,
      parents: [commit.ParentSha],
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  // -- temp force branch over to the commit
  console.log("STEP 3C: ", commit.Id.slice(0, 6));
  await octokit.request("PATCH /repos/{owner}/{repo}/git/refs/heads/{ref}", {
    owner: owner,
    repo: repo,
    ref: newBranchName,
    sha: tempCommit.data.sha,
    force: true,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  // -- merge the commit we want 
  console.log("STEP 3D: ", commit.Id.slice(0, 6));
  const merge = await octokit.request("POST /repos/{owner}/{repo}/merges", {
    owner: owner,
    repo: repo,
    base: newBranchName,
    head: commit.Id,
    force: true,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  // -- create actual commit to be cherry pick
  console.log("STEP 3E: ", commit.Id.slice(0, 6));
  const cherryPickCommit = await octokit.request(
    "POST /repos/{owner}/{repo}/git/commits",
    {
      owner: owner,
      repo: repo,
      tree: merge.data.commit.tree.sha,
      message: commit.Message,
      parents: [newBranchInfo.data.commit.sha],
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  // -- replace temp commit with cherry commit
  console.log("STEP 3F: ", commit.Id.slice(0, 6));
  await octokit.request("PATCH /repos/{owner}/{repo}/git/refs/heads/{ref}", {
    owner: owner,
    repo: repo,
    ref: newBranchName,
    sha: cherryPickCommit.data.sha,
    force: true,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
}

async function createNewBranch(
  octokit: Octokit,
  owner: string,
  repo: string,
  newBranchName: string,
  targetBranchBaseCommitSha: string
) {
  await octokit.request("POST /repos/{owner}/{repo}/git/refs", {
    owner: owner,
    repo: repo,
    ref: "refs/heads/" + newBranchName,
    sha: targetBranchBaseCommitSha,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
}

async function getTargetBranchInfo(
  octokit: Octokit,
  owner: string,
  repo: string,
  targetBranch: string
) {
  const targetBranchInfo = await octokit.request(
    "GET /repos/{owner}/{repo}/branches/{branch}",
    {
      owner: owner,
      repo: repo,
      branch: targetBranch,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  const targetBranchBaseCommitSha = targetBranchInfo.data.commit.sha;
  return targetBranchBaseCommitSha;
}

export async function getPrInfo(
  owner: string,
  repo: string,
  pr: number,
  token: string,
  octokit?: Octokit
) {
  if (!octokit) {
    octokit = instantiateOctokit(token);
  }
  const originalPrInfo = await octokit.request(
    "GET /repos/{owner}/{repo}/pulls/{pull_number}",
    {
      owner: owner,
      repo: repo,
      pull_number: pr,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  const prTitle = originalPrInfo.data.title;
  const sourceBranch = originalPrInfo.data.head.ref;
  const sourceRepoOwner = originalPrInfo.data.user.login;

  return { prTitle, sourceBranch, sourceRepoOwner };
}

export function buildPrUrl(owner: string, repo: string, pr: number): string {
  return `https://github.com/${owner}/${repo}/pull/${pr}`;
}
