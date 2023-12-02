import { AppBar, Toolbar, Typography } from "@mui/material";
import { FC } from "react";
import GitHubIcon from "@mui/icons-material/GitHub";

const NavBar: FC = () => {
  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{
        position: "relative",
        borderBottom: (t) => `1px solid ${t.palette.divider}`,
      }}
    >
      <Toolbar>
        <GitHubIcon fontSize="large" />
        <Typography
          variant="h6"
          color="inherit"
          noWrap
          component="div"
          paddingLeft={"10px"}
          sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
        >
          Github Cherry-Pick Tool
        </Typography>
        <GitHubIcon fontSize="large" />
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
