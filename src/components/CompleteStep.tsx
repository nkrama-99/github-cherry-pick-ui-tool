import {
  Typography,
  Container,
  Paper,
  Box,
  Link,
  IconButton,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { Commit, createCherryPickPR, getPrInfo } from "../helper/OctokitHelper";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ReactTyped from "react-typed";

interface CompleteStepProps {
  githubToken: string;
  owner: string;
  repo: string;
  pr: number;
  targetBranch: string;
  commits: Commit[];
}

const CompleteStep: FC<CompleteStepProps> = ({
  githubToken,
  owner,
  repo,
  pr,
  targetBranch,
  commits,
}) => {
  const [loading, setLoading] = useState(true);
  const [newPrUrl, setNewPrUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const cherryPick = async () => {
      const prInfo = await getPrInfo(owner, repo, pr, githubToken);
      setNewPrUrl(
        await createCherryPickPR(
          githubToken,
          prInfo.sourceRepoOwner,
          repo,
          pr,
          targetBranch,
          commits,
          prInfo.sourceBranch,
          prInfo.prTitle,
          owner
        )
      );
    };

    cherryPick()
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        console.log("error on cherryPick:", err);
        setError(err.message);
        setLoading(false);
      });

    return () => {};
  }, [githubToken, owner, repo, pr, targetBranch, commits]);

  const onClickImage = () => {
    window.location.reload();
  };

  function renderLoading() {
    return (
      <>
        <Typography component="h1" variant="h6" align="center" gutterBottom>
          <div>
            <ReactTyped
              strings={["Picking Cherries...", "Picking Cher", "Pick", "P", "Picking", "Cherries"]}
              typeSpeed={40}
              loop
              backSpeed={20}
              showCursor={true}
            />
          </div>
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <img
            alt=""
            src={process.env.PUBLIC_URL + "/cherry-loading.gif"}
          ></img>
        </Box>
      </>
    );
  }

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
          Retry. If it fails again, maybe there were some conflicts in the
          cherry-picking process. You may need to manually do it this time :|
        </Typography>
      </>
    );
  }

  function renderSuccess() {
    return (
      <>
        <Typography component="h1" variant="h4" align="center" padding={"10px"}>
          Success!
        </Typography>
        <Box
          sx={{ display: "flex", justifyContent: "center" }}
          padding={"20px"}
        >
          <Link
            href={newPrUrl}
            target="_blank"
            rel="noopener noreferrer"
            align="center"
          >
            <Typography variant="h6">{newPrUrl}</Typography>
          </Link>
          <CopyToClipboard text={newPrUrl}>
            <IconButton>
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </CopyToClipboard>
        </Box>
        <Box
          sx={{ display: "flex", justifyContent: "center" }}
          padding={"20px"}
        >
          <img
            alt=""
            style={{
              cursor: "pointer",
            }}
            onClick={() => onClickImage()}
            src={process.env.PUBLIC_URL + "/dj-khaled-another-one.gif"}
          ></img>
        </Box>
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
          : newPrUrl
          ? renderSuccess()
          : renderFailure()}
      </Paper>
    </Container>
  );
};

export default CompleteStep;
