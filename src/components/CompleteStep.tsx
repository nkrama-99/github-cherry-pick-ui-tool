import { Typography, Container, Paper, Box, Link } from "@mui/material";
import { FC } from "react";

interface CompleteStepProps {
  newPrUrl: string;
}

const CompleteStep: FC<CompleteStepProps> = ({ newPrUrl }) => {
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
      </Paper>
    </Container>
  );
};

export default CompleteStep;
