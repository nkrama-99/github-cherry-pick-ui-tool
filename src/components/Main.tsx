import { FC, useState } from "react";
import { Container, Step, StepLabel, Stepper } from "@mui/material";
import FindStep from "./FindStep";
import ReviewStep from "./ReviewStep";
import CompleteStep from "./CompleteStep";
import { Commit } from "../helper/OctokitHelper";

const steps = ["Find", "Review", "Complete"];

const MainBody: FC = () => {
  const [stage, setStage] = useState(0);
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [pr, setPR] = useState(-1);
  const [githubToken, setGithubToken] = useState("");
  const [targetBranch, setTargetBranch] = useState("");
  const [commits, setCommits] = useState<Commit[]>([]);

  const handleNext = () => {
    setStage((prevStage) => prevStage + 1);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <FindStep
            nextStage={handleNext}
            owner={owner}
            setOwner={setOwner}
            repo={repo}
            setRepo={setRepo}
            pr={pr}
            setPR={setPR}
            githubToken={githubToken}
            setGithubToken={setGithubToken}
          />
        );
      case 1:
        return (
          <ReviewStep
            githubToken={githubToken}
            nextStage={handleNext}
            owner={owner}
            repo={repo}
            pr={pr}
            commits={commits}
            setCommits={setCommits}
            targetBranch={targetBranch}
            setTargetBranch={setTargetBranch}
          />
        );
      case 2:
        return (
          <CompleteStep
            githubToken={githubToken}
            owner={owner}
            repo={repo}
            pr={pr}
            commits={commits}
            targetBranch={targetBranch}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container component="main">
      <Stepper activeStep={stage} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Container>{getStepContent(stage)}</Container>
    </Container>
  );
};

export default MainBody;
