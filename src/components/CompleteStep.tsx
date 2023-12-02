import { Typography, Container, Paper, Box } from "@mui/material";
import { FC } from "react";

const CompleteStep: FC = () => {
  return (
    <Container>
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <Typography component="h1" variant="h4" align="center">
          Done!
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <img
            src={process.env.PUBLIC_URL + "/dj-khaled-another-one.gif"}
          ></img>
        </Box>
      </Paper>
    </Container>
  );
};

export default CompleteStep;
