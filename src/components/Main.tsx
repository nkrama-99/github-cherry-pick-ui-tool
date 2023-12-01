import { Container, Paper, Typography } from "@mui/material";
import { Dispatch, FC, SetStateAction, useState } from "react";

interface MainProps {
  githubToken: string;
}

const MainBody: FC<MainProps> = ({ githubToken }) => {
  const [stage, setStage] = useState(0) 
  
  return (
    <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <Typography component="h1" variant="h4" align="center">
          Let's get started
        </Typography>
      </Paper>
    </Container>
  );
};

export default MainBody;
