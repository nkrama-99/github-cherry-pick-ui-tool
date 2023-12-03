import { CssBaseline } from "@mui/material";
import React from "react";
import Footer from "./components/Footer";
import NavBar from "./components/Toolbar";
import MainBody from "./components/Main";

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <NavBar />
      <MainBody />
      <Footer />
    </React.Fragment>
  );
}

export default App;
