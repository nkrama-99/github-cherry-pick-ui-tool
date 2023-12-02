import {
  Typography,
  Container,
  Paper,
  Grid,
  TextField,
  Button,
} from "@mui/material";
import { FC } from "react";

interface FindStepProps {
  nextStage: (stageId: number) => void;
  owner: String;
  setOwner: React.Dispatch<React.SetStateAction<string>>;
  repo: String;
  setRepo: React.Dispatch<React.SetStateAction<string>>;
  pr: number;
  setPR: React.Dispatch<React.SetStateAction<number>>;
  githubToken: String;
  setGithubToken: React.Dispatch<React.SetStateAction<string>>;
}

const FindStep: FC<FindStepProps> = ({
  nextStage,
  owner,
  setOwner,
  repo,
  setRepo,
  pr,
  setPR,
  githubToken,
  setGithubToken,
}) => {
  const onClickFind = () => {
    console.log(githubToken, owner, repo, pr);
    if (githubToken && owner && repo && pr > 0) {
      console.log("Valid inputs!");
      nextStage(1);
    } else {
      console.log("Invalid inputs!");
    }
  };

  const onChangeUrl = (url: string) => {
    const regex = /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)$/;
    const match = url.match(regex);
    if (match) {
      console.log("Match!");
      const [, ownerName, repoName, prNumber] = match;
      setOwner(ownerName);
      setRepo(repoName);
      const num = parseInt(prNumber);
      if (num) {
        setPR(num);
      }
    } else {
      console.log("Unexpected entry");
    }
  };

  return (
    <Container>
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Step 1: Find your PR
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              label="URL to PR"
              fullWidth
              autoComplete="github-cherry-pick-tool-url"
              variant="standard"
              placeholder="https://github.com/owner_name/repo_name/pull/pr_number"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                console.log("url:", event.target.value);
                onChangeUrl(event.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              label="GitHub Token"
              fullWidth
              type="password"
              autoComplete="github-cherry-pick-tool-github-token"
              variant="standard"
              placeholder="https://github.com/owner_name/repo_name/pull/pr_number"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setGithubToken(event.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Button fullWidth variant="contained" onClick={() => onClickFind()}>
              Find
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default FindStep;
