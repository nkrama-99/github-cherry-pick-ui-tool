import { Typography, Link } from "@mui/material";
import { FC } from "react";

const Footer: FC = () => {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link
        color="inherit"
        href="https://www.linkedin.com/in/ramakrishna-natarajan/"
      >
        Drizzy
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

export default Footer;
