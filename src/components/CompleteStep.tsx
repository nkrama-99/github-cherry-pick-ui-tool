import { Typography, Container, Paper, Box } from "@mui/material";
import { FC } from "react";

const CompleteStep: FC = () => {
  const onClickImage = () => {
    console.log("test");
    window.location.reload();
  };
  return (
    <Container>
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <Typography component="h1" variant="h4" align="center">
          Success!
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <img
            style={{
              cursor: "pointer",
            }}
            onClick={() => onClickImage()}
            src={process.env.PUBLIC_URL + "/dj-khaled-another-one.gif"}
          ></img>
        </Box>
      </Paper>
    </Container>
  );
};

export default CompleteStep;
