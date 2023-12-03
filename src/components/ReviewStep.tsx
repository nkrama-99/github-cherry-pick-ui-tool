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
  Link,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import {
  getCommitsInPR,
  Commit,
  getPrInfo,
  buildPrUrl,
} from "../helper/OctokitHelper";
import CommitIcon from "@mui/icons-material/Commit";

const MAX_COMMIT_ID_LEN = 6;

interface ReviewStepProps {
  githubToken: string;
  nextStage: (stageId: number) => void;
  owner: string;
  repo: string;
  pr: number;
  commits: Commit[];
  setCommits: React.Dispatch<React.SetStateAction<Commit[]>>;
  targetBranch: string;
  setTargetBranch: React.Dispatch<React.SetStateAction<string>>;
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
  commits,
  setCommits,
  targetBranch,
  setTargetBranch,
}) => {
  const [prTitle, setPrTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const retrieveData = async () => {
      setCommits(await getCommitsInPR(githubToken, owner, repo, pr));
      setPrTitle((await getPrInfo(owner, repo, pr, githubToken)).prTitle);
    };

    retrieveData()
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        console.log("error on retrieveData:", err);
        setLoading(false);
      });

    return () => {};
  }, [githubToken, owner, repo, pr]);

  const onClickCherryPick = async () => {
    nextStage(2);
  };

  function renderFailure() {
    return (
      <>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Opps something went wrong
        </Typography>
        <Typography component="h1" variant="h6" align="center" gutterBottom>
          Verify your URL and GitHub token.
        </Typography>
      </>
    );
  }

  function renderSuccess() {
    return (
      <>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Step 2: Review Commits
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Link
              href={buildPrUrl(owner, repo, pr)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Typography variant="h6">PR: {prTitle}</Typography>
            </Link>
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
      </>
    );
  }

  function renderLoading() {
    return (
      <>
        <Typography component="h1" variant="h6" align="center" gutterBottom>
          Fetching...
        </Typography>
      </>
    );
  }

  return (
    <Container>
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        {loading
          ? renderLoading()
          : commits.length > 0
          ? renderSuccess()
          : renderFailure()}
      </Paper>
    </Container>
  );
};

export default ReviewStep;
