import { Octokit } from "octokit";

export interface Commit {
  Id: string;
  Message: string;
}

const instantiateOctokit = (token: string) => {
  return new Octokit({
    auth: token,
  });
};

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

    return mapToCommitList(response.data);
  } catch (error) {
    console.error("Error fetching commits:", error);
    return [];
  }
}

export async function createCherryPickPR(
  token: string,
  owner: string,
  repo: string,
  targetBranch: string,
  commits: Commit[]
): Promise<Commit[]> {
  try {
    const octokit = instantiateOctokit(token);

    // https://chat.openai.com/share/f0c48674-4bea-418d-ab63-2794a8ad572a
    
    // Create a new branch off of target branch

    // Cherry-pick changes into new branch

    // Create PR for new branch

    return [];
  } catch (error) {
    console.error("Error fetching commits:", error);
    return [];
  }
}
