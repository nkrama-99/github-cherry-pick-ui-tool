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
  Autocomplete,
  Checkbox,
  Tooltip,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import {
  getCommitsInPR,
  Commit,
  getPrInfo,
  buildPrUrl,
  getBranchesInRepo,
} from "../helper/OctokitHelper";
import CommitIcon from "@mui/icons-material/Commit";
import ReactTyped from "react-typed";

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

const CommitListItem = (
  item: Commit,
  index: number,
  handleCheckboxChange: (changedCommit: Commit) => void
) => {
  return (
    <ListItem key={index}>
      <Tooltip title="If checked, commit will be cherry-picked">
        <ListItemIcon>
          <Checkbox
            onChange={() => {
              handleCheckboxChange(item);
            }}
            checked={item.ToCherryPick}
          />
        </ListItemIcon>
      </Tooltip>
      <ListItemIcon>
        <CommitIcon />
      </ListItemIcon>
      <ListItemText
        primary={index + 1 + ") " + item.Message}
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
  const [branches, setBranches] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const retrieveData = async () => {
      const prInfo = await getPrInfo(owner, repo, pr, githubToken);
      setBranches(
        await getBranchesInRepo(githubToken, prInfo.sourceRepoOwner, repo)
      );
      setCommits(await getCommitsInPR(githubToken, owner, repo, pr));
      setPrTitle(prInfo.prTitle);
    };

    retrieveData()
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        console.log("error on retrieveData:", err);
        setError(err.message);
        setLoading(false);
      });

    return () => {};
  }, [githubToken, owner, repo, pr]);

  const onClickCherryPick = async () => {
    if (targetBranch) {
      nextStage(2);
    } else {
      console.log("Invalid inputs!");
    }
  };

  const handleCheckboxChange = (changedCommit: Commit) => {
    setCommits((prevCommits) => {
      const updatedCommits = prevCommits.map((commit) =>
        commit.Id === changedCommit.Id
          ? { ...commit, ToCherryPick: !commit.ToCherryPick } // Toggle the toCherryPick value
          : commit
      );
      return updatedCommits;
    });
  };

  function renderFailure() {
    return (
      <>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Opps something went wrong
        </Typography>
        <Typography
          component="h1"
          variant="h6"
          align="center"
          color={"red"}
          gutterBottom
        >
          Error: {error}... Check console logs for more info.
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
              {commits.map((item, index) =>
                CommitListItem(item, index, handleCheckboxChange)
              )}
            </List>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12}>
                <Autocomplete
                  options={branches} // You can replace this with your list of options
                  getOptionLabel={(option) => option} // Provide a function to extract the label from each option
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Target Branch"
                      fullWidth
                      variant="standard"
                    />
                  )}
                  onChange={(event: any, newValue: string | null) => {
                    if (newValue) {
                      setTargetBranch(newValue);
                    } else {
                      setTargetBranch("");
                    }
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
          <div>
            <ReactTyped
              strings={["Fetching...", "Fetc", "Fetchi"]}
              typeSpeed={20}
              loop
              backSpeed={20}
              showCursor={true}
            />
          </div>
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
