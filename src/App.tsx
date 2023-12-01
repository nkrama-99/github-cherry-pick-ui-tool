import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";

function App() {
  return (
    <main>
      <AppBar
        position="absolute"
        color="default"
        elevation={0}
        sx={{
          position: "relative",
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Toolbar>Github Cherry-Pick Tool</Toolbar>
      </AppBar>
      <Container component="main">
        <Box>
          <Typography>Let's Cherry Pick</Typography>
        </Box>
      </Container>
    </main>
  );
}

export default App;
