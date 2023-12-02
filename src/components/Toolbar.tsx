import React, { Dispatch, FC, SetStateAction } from "react";
import { AppBar, Box, Typography, TextField, Toolbar } from "@mui/material";

const NavBar: FC = () => {
  return (
    <AppBar
      position="absolute"
      color="default"
      elevation={0}
      sx={{
        position: "relative",
        borderBottom: (t) => `1px solid ${t.palette.divider}`,
      }}
    >
      <Toolbar>
        <Box justifySelf={"left"}>
          <Typography variant="h6" color="inherit" noWrap>
            Github Cherry-Pick Tool
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
