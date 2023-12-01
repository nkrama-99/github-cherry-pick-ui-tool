import { Button, Container, Paper, Typography } from "@mui/material";
import { Dispatch, FC, SetStateAction, useState } from "react";
import DetailsStage from "./DetailsStage";

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
        {stage >= 0 && <DetailsStage />}
        {stage >= 1 && (
          <Typography component="h1" variant="h4" align="center">
            Stage 1
          </Typography>
        )}
        {stage >= 2 && (
          <Typography component="h1" variant="h4" align="center">
            Stage 2
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default MainBody;
