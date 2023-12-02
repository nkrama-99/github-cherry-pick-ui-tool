import {
  Typography,
  Container,
  Paper,
  Grid,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { getCommitsInPR, Commit, createCherryPickPR } from "../helper/OctokitHelper";
import CommitIcon from "@mui/icons-material/Commit";

const MAX_COMMIT_ID_LEN = 6;

interface ReviewStepProps {
  githubToken: string;
  nextStage: (stageId: number) => void;
  owner: string;
  repo: string;
  pr: number;
}

const CommitListItem = (item: Commit, index: number) => {
  return (
    <ListItem key={index}>
      <ListItemIcon>
        <CommitIcon />
      </ListItemIcon>
      <ListItemText
        primary={item.Message}
        secondary={item.Id.slice(0, MAX_COMMIT_ID_LEN)}
      ></ListItemText>
    </ListItem>
  );
};

const ReviewStep: FC<ReviewStepProps> = ({
  githubToken,
  nextStage,
  owner,
  repo,
  pr,
}) => {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [targetBranch, setTargetBranch] = useState("");

  useEffect(() => {
    const retrieveData = async () => {
      setCommits(await getCommitsInPR(githubToken, owner, repo, pr));
    };
    retrieveData();

    return () => {};
  }, []);

  const onClickCherryPick = () => {
    // console.log("commits:", commits);
    // console.log("targetBranch:", targetBranch);
    createCherryPickPR(githubToken, owner, repo, pr, targetBranch, commits);
    // nextStage();
  };

  return (
    <Container>
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Step 2: Review Commits
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <List>
              {commits.map((item, index) => CommitListItem(item, index))}
            </List>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  label="Target Branch"
                  fullWidth
                  autoComplete="github-cherry-pick-target-branch"
                  variant="standard"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setTargetBranch(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={onClickCherryPick}
                >
                  Cherry pick
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ReviewStep;
