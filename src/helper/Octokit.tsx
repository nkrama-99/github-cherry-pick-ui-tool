import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: "",
});

export async function getCommitsInPR(owner: string, repo: string, prNumber: number) {
  try {
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

    console.log(response);
  } catch (error) {
    console.error("Error fetching commits:", error);
    throw error;
  }
}