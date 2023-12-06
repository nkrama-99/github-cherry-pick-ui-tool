import { Typography, Link } from "@mui/material";
import { FC } from "react";

const Footer: FC = () => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      paddingBottom={"20px"}
    >
      {"Copyright © "}
      <Link
        color="inherit"
        href="https://www.youtube.com/watch?v=XqpQpt_cmhE&ab_channel=DrakeVEVO"
      >
        Drizzy
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

export default Footer;
