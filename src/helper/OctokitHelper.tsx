import { Octokit } from "octokit";

const BRANCH_NAME_RANDOM_NUMBER_LIMIT = 101;

export interface Commit {
  Id: string;
  Message: string;
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
  try {
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
      };
    });
  } catch (error) {
    console.error("Error fetching commits:", error);
    return [];
  }
}

export async function createCherryPickPR(
  token: string,
  owner: string,
  repo: string,
  pr: number,
  targetBranch: string,
  commits: Commit[]
): Promise<void> {
  try {
    const octokit = instantiateOctokit(token);

    console.log(">>>>>>>>>>>>> START");

    // -- retrieve original PR info
    console.log("STEP 1");
    const { prTitle, sourceBranch } = await getPrInfo(octokit, owner, repo, pr);

    // -- retrieve target branch info
    console.log("STEP 2");
    const targetBranchBaseCommitSha = await getTargetBranchInfo(
      octokit,
      owner,
      repo,
      targetBranch
    );

    // -- Create a new branch off of target branch
    console.log("STEP 3");
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
    console.log("STEP 4");
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
    console.log("STEP 5");
    await createPrToTargetBranch(
      octokit,
      owner,
      repo,
      prTitle,
      targetBranch,
      pr,
      newBranchName
    );

    console.log(">>>>>>>>>>>>> COMPLETE");
    return;
  } catch (error) {
    console.error("Error fetching commits:", error);
    return;
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
) {
  await octokit.request("POST /repos/{owner}/{repo}/pulls", {
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
}

async function cherryPickCommit(
  commit: Commit,
  octokit: Octokit,
  owner: string,
  repo: string,
  newBranchName: string
) {
  // -- get branch info
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
  const newBranchTreeSha = newBranchInfo.data.commit.commit.tree.sha;

  // -- create the commit
  const tempCommit = await octokit.request(
    "POST /repos/{owner}/{repo}/git/commits",
    {
      owner: owner,
      repo: repo,
      tree: newBranchTreeSha,
      message: "TEMP" + commit.Message,
      parents: [commit.Id],
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  // -- temp force branch over to the correct commit
  await octokit.request("PATCH /repos/{owner}/{repo}/git/refs/heads/{ref}", {
    owner: owner,
    repo: repo,
    ref: newBranchName,
    sha: tempCommit.data.parents[0].sha,
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

async function getPrInfo(
  octokit: Octokit,
  owner: string,
  repo: string,
  pr: number
) {
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

  return { prTitle, sourceBranch };
}
