import { Typography, Container, Paper, Box, Link } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { Commit, createCherryPickPR } from "../helper/OctokitHelper";

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

  useEffect(() => {
    const cherryPick = async () => {
      setNewPrUrl(
        await createCherryPickPR(
          githubToken,
          owner,
          repo,
          pr,
          targetBranch,
          commits
        )
      );
    };
    cherryPick()
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        console.log("error on cherryPick:", err);
        setLoading(false);
      });
    return () => {};
  }, [githubToken, owner, repo, pr, targetBranch, commits]);

  const onClickImage = () => {
    console.log("test");
    window.location.reload();
  };

  function renderLoading() {
    return (
      <>
        <Typography component="h1" variant="h6" align="center" gutterBottom>
          Picking cherries...
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <img src={process.env.PUBLIC_URL + "/drizzy-loading.gif"}></img>
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
        <Typography component="h1" variant="h6" align="center" gutterBottom>
          Sorry try again. If it fails again, maybe there were some conflicts in
          the cherry-picking process. Check console logs for more information.
          You may need to manually do it this time :|
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
        <Link
          href={newPrUrl}
          target="_blank"
          rel="noopener noreferrer"
          align="center"
        >
          <Typography variant="h6">{newPrUrl}</Typography>
        </Link>
        <Box
          sx={{ display: "flex", justifyContent: "center" }}
          padding={"20px"}
        >
          <img
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
