import {
  AppBar,
  Button,
  IconButton,
  Link,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { FC } from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import CherryIcon from "./CherryIcon";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

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
        <CherryIcon />
        <Typography
          paddingLeft={"10px"}
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
        <Tooltip title="Restart cherry-picking process">
          <IconButton
            onClick={() => {
              window.location.reload();
            }}
          >
            <RestartAltIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
