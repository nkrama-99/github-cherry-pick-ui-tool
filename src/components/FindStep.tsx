import { Typography, Link, Container, Divider, Paper } from "@mui/material";
import { FC } from "react";

const FindStep: FC = () => {
  return (
    <Container>
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <Typography component="h1" variant="h4" align="center">
          Find PR
        </Typography>
      </Paper>
    </Container>
  );
};

export default FindStep;
