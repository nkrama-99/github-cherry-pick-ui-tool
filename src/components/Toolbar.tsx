import { AppBar, Link, Toolbar, Tooltip, Typography } from "@mui/material";
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
        <Typography
          variant="subtitle1"
          color="inherit"
          noWrap
          component="div"
          sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
        >
          Github Cherry-Pick Tool
        </Typography>
        <Tooltip title="Link to repo" arrow>
          <Link
            color={"inherit"}
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/nkrama-99/github-cherry-pick-ui-tool"
          >
            <GitHubIcon fontSize="large" />
          </Link>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
