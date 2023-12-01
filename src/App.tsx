import { CssBaseline } from "@mui/material";
import React from "react";
import Footer from "./components/Footer";
import NavBar from "./components/Toolbar";
import MainBody from "./components/Main";

function App() {
  const [githubToken, setGithubToken] = React.useState("");

  return (
    <React.Fragment>
      <CssBaseline />
      <NavBar setGithubToken={setGithubToken} />
      <MainBody githubToken={githubToken} />
      <Footer />
    </React.Fragment>
  );
}

export default App;
