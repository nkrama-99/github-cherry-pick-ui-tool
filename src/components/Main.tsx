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

  return (
    <Container component="main">
      <Button
        onClick={() => {
          if (stage == 2) {
            setStage(0);
          } else {
            setStage(stage + 1);
          }
        }}
      >
        Test
      </Button>
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        {stage >= 0 && <FindStep />}
        {stage >= 1 && <ReviewStep />}
        {stage >= 2 && <CompleteStep />}
      </Paper>
    </Container>
  );
};

export default MainBody;
