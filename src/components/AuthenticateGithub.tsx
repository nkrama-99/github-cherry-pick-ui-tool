import { Button } from "@mui/material";
import React from "react";
import { getCommitsInPR } from "../helper/Octokit";

export default function AuthenticateGithub() {
  return (
    <React.Fragment>
      <Button onClick={async () => {
        await getCommitsInPR(
          "nkrama-99",
          "ECE568_Computer_Security_Labs",
          2
        );
      }}>Authenticate</Button>
    </React.Fragment>
  );
}
