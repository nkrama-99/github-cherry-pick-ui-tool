import { Button, Container } from "@mui/material";
import { FC, useState } from "react";
import FindStep from "./FindStep";
import ReviewStep from "./ReviewStep";
import CompleteStep from "./CompleteStep";
import { Commit } from "../helper/OctokitHelper";

const MainBody: FC = () => {
  const [stage, setStage] = useState(0);
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [pr, setPR] = useState(-1);
  const [githubToken, setGithubToken] = useState("");
  const [targetBranch, setTargetBranch] = useState("");
  const [commits, setCommits] = useState<Commit[]>([]);

  const nextStage = (stageId: number) => {
    setStage(stageId);
  };

  return (
    <Container component="main">
      {/* <Button
        onClick={() => {
          nextStage(stage + 1);
        }}
      >
        Test stages
      </Button> */}
      <Container>
        {stage >= 0 && (
          <FindStep
            nextStage={nextStage}
            owner={owner}
            setOwner={setOwner}
            repo={repo}
            setRepo={setRepo}
            pr={pr}
            setPR={setPR}
            githubToken={githubToken}
            setGithubToken={setGithubToken}
          />
        )}
        {stage >= 1 && (
          <ReviewStep
            githubToken={githubToken}
            nextStage={nextStage}
            owner={owner}
            repo={repo}
            pr={pr}
            commits={commits}
            setCommits={setCommits}
            targetBranch={targetBranch}
            setTargetBranch={setTargetBranch}
          />
        )}
        {stage >= 2 && (
          <CompleteStep
            githubToken={githubToken}
            owner={owner}
            repo={repo}
            pr={pr}
            commits={commits}
            targetBranch={targetBranch}
          />
        )}
      </Container>
    </Container>
  );
};

export default MainBody;
