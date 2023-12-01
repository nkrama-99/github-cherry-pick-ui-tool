import { Octokit } from "octokit";

export interface Commit {
  Id: string;
  Message: string;
}

const mapToCommitList = (jsonPayload: any[]): Commit[] => {
  return jsonPayload.map((commitInfo) => {
    return {
      Id: commitInfo.sha,
      Message: commitInfo.commit.message,
    };
  });
};

export async function getCommitsInPR(
  token: string,
  owner: string,
  repo: string,
  prNumber: number
): Promise<Commit[]> {
  try {
    const octokit = new Octokit({
      auth: token,
    });

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
    
    return mapToCommitList(response.data);
  } catch (error) {
    console.error("Error fetching commits:", error);
    return [];
  }
}
