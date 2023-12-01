import { Button, Container, Paper, Typography } from "@mui/material";
import { Dispatch, FC, SetStateAction, useState } from "react";
import FindStep from "./FindStep";
import ReviewStep from "./ReviewStep";
import CompleteStep from "./CompleteStep";

interface MainProps {
  githubToken: string;
}

const MainBody: FC<MainProps> = ({ githubToken }) => {
  const [stage, setStage] = useState(0);
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [pr, setPR] = useState(-1);

  const nextStage = () => {
    if (stage == 2) {
      setStage(0);
    } else {
      setStage(stage + 1);
    }
  };

  return (
    <Container component="main">
      <Button
        onClick={() => {
          nextStage();
        }}
      >
        Test
      </Button>
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
          />
        )}
        {stage >= 1 && <ReviewStep />}
        {stage >= 2 && <CompleteStep />}
      </Container>
    </Container>
  );
};

export default MainBody;
