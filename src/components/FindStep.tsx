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
  nextStage: () => void;
  owner: String;
  setOwner: React.Dispatch<React.SetStateAction<string>>;
  repo: String;
  setRepo: React.Dispatch<React.SetStateAction<string>>;
  pr: number;
  setPR: React.Dispatch<React.SetStateAction<number>>;
}

const FindStep: FC<FindStepProps> = ({
  nextStage,
  owner,
  setOwner,
  repo,
  setRepo,
  pr,
  setPR,
}) => {
  const onClickFind = () => {
    if (owner && repo && pr > 0) {
      nextStage();
    }
  };

  return (
    <Container>
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Find your PR
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <TextField
              required
              label="Owner"
              fullWidth
              autoComplete="github-cherry-pick-tool-owner"
              variant="standard"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setOwner(event.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              required
              label="Repository"
              fullWidth
              autoComplete="github-cherry-pick-tool-repo"
              variant="standard"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setRepo(event.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              required
              label="PR #"
              fullWidth
              variant="standard"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const num = parseInt(event.target.value);
                if (num) {
                  setPR(num);
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Button fullWidth variant="contained" onClick={onClickFind}>
              Find
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default FindStep;
