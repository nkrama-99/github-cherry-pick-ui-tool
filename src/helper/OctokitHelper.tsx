import { Octokit } from "octokit";

const BRANCH_NAME_RANDOM_NUMBER_LIMIT = 101;

export interface Commit {
  Id: string;
  Message: string;
  parentSha: string;
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
        parentSha: commitInfo.parents[0].sha,
      };
    });
    // return mapToCommitList(response.data);
  } catch (error) {
    console.error("Error fetching commits:", error);
    return [];
  }
}

// export async function createCherryPickPR_OLD(
//   token: string,
//   owner: string,
//   repo: string,
//   pr: number,
//   targetBranch: string,
//   commits: Commit[]
// ): Promise<Commit[]> {
//   try {
//     const octokit = instantiateOctokit(token);

//     // https://chat.openai.com/share/f0c48674-4bea-418d-ab63-2794a8ad572a

//     // -- retrieve original PR info
//     const originalPrInfo = await octokit.request(
//       "GET /repos/{owner}/{repo}/pulls/{pull_number}",
//       {
//         owner: owner,
//         repo: repo,
//         pull_number: pr,
//         headers: {
//           "X-GitHub-Api-Version": "2022-11-28",
//         },
//       }
//     );

//     const prTitle = originalPrInfo.data.title;
//     const sourceBranch = originalPrInfo.data.head.ref;
//     console.log("STEP 1");
//     console.log("prTitle:", prTitle);
//     console.log("sourceBranch:", sourceBranch);
//     console.log(commits);

//     // -- retrieve target branch info
//     const targetBranchInfo = await octokit.request(
//       "GET /repos/{owner}/{repo}/branches/{branch}",
//       {
//         owner: owner,
//         repo: repo,
//         branch: targetBranch,
//         headers: {
//           "X-GitHub-Api-Version": "2022-11-28",
//         },
//       }
//     );

//     const targetBranchBaseCommitSha = targetBranchInfo.data.commit.sha;
//     console.log("STEP 2");
//     console.log("targetBranchBaseCommitSha", targetBranchBaseCommitSha);

//     // -- Create a new branch off of target branch
//     const newBranchName =
//       targetBranch +
//       "_" +
//       sourceBranch +
//       "_" +
//       Math.floor(Math.random() * BRANCH_NAME_RANDOM_NUMBER_LIMIT);

//     const newBranchInfo = await octokit.request(
//       "POST /repos/{owner}/{repo}/git/refs",
//       {
//         owner: owner,
//         repo: repo,
//         ref: "refs/heads/" + newBranchName,
//         sha: targetBranchBaseCommitSha,
//         headers: {
//           "X-GitHub-Api-Version": "2022-11-28",
//         },
//       }
//     );

//     console.log("STEP 3");
//     console.log(newBranchInfo);
//     console.log("newBranchInfo.data.ref", newBranchInfo.data.ref);

//     // -- Create new tree and add commits to it
//     const newTreeInfo = await octokit.request(
//       "POST /repos/{owner}/{repo}/git/trees",
//       {
//         owner: owner,
//         repo: repo,
//         sha: targetBranchBaseCommitSha,
//         tree: commits.map((commit) => ({
//           // path: `path/to/file`,
//           mode: "100644",
//           type: "blob",
//           sha: commit.Id,
//         })),
//         headers: {
//           "X-GitHub-Api-Version": "2022-11-28",
//         },
//       }
//     );

//     // -- Cherry-pick changes into new branch
//     // console.log("STEP 4");
//     // for (const commit of commits) {
//     //   await octokit.request("POST /repos/{owner}/{repo}/git/refs", {
//     //     owner: owner,
//     //     repo: repo,
//     //     ref: "refs/heads/" + "temp" + commit.Id,
//     //     sha: commit.Id,
//     //     headers: {
//     //       "X-GitHub-Api-Version": "2022-11-28",
//     //     },
//     //   });

//     //   await octokit.request("POST /repos/{owner}/{repo}/merges", {
//     //     owner: owner,
//     //     repo: repo,
//     //     base: "refs/heads/" + newBranchName,
//     //     head: "refs/heads/" + "temp" + commit.Id,
//     //     headers: {
//     //       "X-GitHub-Api-Version": "2022-11-28",
//     //     },
//     //   });

//     //   console.log("cherry-pick done", commit.Id, commit.Message);
//     // }

//     // Create PR for new branch
//     // const newPr = await octokit.request("POST /repos/{owner}/{repo}/pulls", {
//     //   owner: owner,
//     //   repo: repo,
//     //   title: "Amazing new feature",
//     //   body: "Please pull these awesome changes in!",
//     //   head: "new-feature-branch",
//     //   base: targetBranch,
//     //   headers: {
//     //     "X-GitHub-Api-Version": "2022-11-28",
//     //   },
//     // });

//     return [];
//   } catch (error) {
//     console.error("Error fetching commits:", error);
//     return [];
//   }
// }

export async function createCherryPickPR(
  token: string,
  owner: string,
  repo: string,
  pr: number,
  targetBranch: string,
  commits: Commit[]
): Promise<Commit[]> {
  try {
    const octokit = instantiateOctokit(token);

    // -- retrieve original PR info
    console.log("STEP 1");

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

    console.log("prTitle:", prTitle);
    console.log("sourceBranch:", sourceBranch);
    console.log(commits);

    // -- retrieve target branch info
    console.log("STEP 2");

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
    console.log("targetBranchBaseCommitSha", targetBranchBaseCommitSha);

    // -- Create a new branch off of target branch
    console.log("STEP 3");

    const newBranchName =
      targetBranch +
      "_" +
      sourceBranch +
      "_" +
      Math.floor(Math.random() * BRANCH_NAME_RANDOM_NUMBER_LIMIT);

    await octokit.request("POST /repos/{owner}/{repo}/git/refs", {
      owner: owner,
      repo: repo,
      ref: "refs/heads/" + newBranchName,
      sha: targetBranchBaseCommitSha,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

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

    const newBranchSha = newBranchInfo.data.commit.sha;
    const newBranchTreeSha = newBranchInfo.data.commit.commit.tree.sha;
    console.log("newBranchSharef", newBranchSha);
    console.log("newBranchTreeSha", newBranchTreeSha);

    // -- start picking
    console.log("STEP 4a");
    let parentCommit = commits[0];
    const tempCommit = await octokit.request(
      "POST /repos/{owner}/{repo}/git/commits",
      {
        owner: owner,
        repo: repo,
        tree: newBranchTreeSha,
        message: "TEMP" + parentCommit.Message,
        parents: [parentCommit.Id],
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    console.log("tempCommit.data.sha", tempCommit.data.sha);

    // -- temp force branch over to that commit
    console.log("STEP 4b");
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

    // merge the commit we want
    console.log("STEP 4c");
    const merge = await octokit.request("POST /repos/{owner}/{repo}/merges", {
      owner: owner,
      repo: repo,
      base: newBranchName,
      head: parentCommit.parentSha,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    console.log(merge);
    const mergeTreeSha = merge.data.commit.tree.sha; // what it should look like

    // create cherry-pick commit
    console.log("STEP 4d");
    const cherryPickCommit = await octokit.request(
      "POST /repos/{owner}/{repo}/git/commits",
      {
        owner: owner,
        repo: repo,
        tree: mergeTreeSha,
        message: parentCommit.Message,
        parents: [newBranchSha],
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    // replace temp commit with real commit
    console.log("STEP 4e");
    await octokit.request("PATCH /repos/{owner}/{repo}/git/refs/heads/{ref}", {
      owner: owner,
      repo: repo,
      sha: cherryPickCommit.data.sha,
      ref: newBranchName,
      force: true,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    return [];
  } catch (error) {
    console.error("Error fetching commits:", error);
    return [];
  }
}
