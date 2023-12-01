import {
  Typography,
  Container,
  Paper,
  Grid,
  TextField,
  Button,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { getCommitsInPR, Commit } from "../helper/OctokitHelper";

interface ReviewStepProps {
  githubToken: string;
  nextStage: () => void;
  owner: string;
  repo: string;
  pr: number;
}

const ReviewStep: FC<ReviewStepProps> = ({
  githubToken,
  nextStage,
  owner,
  repo,
  pr,
}) => {
  const [commits, setCommits] = useState<Commit[]>([]);

  useEffect(() => {
    const retrieveData = async () => {
      setCommits(await getCommitsInPR(githubToken, owner, repo, pr));
    };
  }, []);

  const onClickCherryPick = () => {
    console.log(commits);
  }

  return (
    <Container>
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Review
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              label="Owner"
              fullWidth
              autoComplete="github-cherry-pick-tool-owner"
              variant="standard"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              label="Owner"
              fullWidth
              autoComplete="github-cherry-pick-tool-owner"
              variant="standard"
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Button fullWidth variant="contained">
              Cherry pick
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ReviewStep;
