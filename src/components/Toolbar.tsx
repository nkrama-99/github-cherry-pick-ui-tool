import React, { Dispatch, FC, SetStateAction } from 'react';
import { AppBar, Box, Typography, TextField, Toolbar } from '@mui/material';

interface ToolbarProps {
  setGithubToken: Dispatch<SetStateAction<string>>;
}

const NavBar: FC<ToolbarProps> = ({ setGithubToken }) => {
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
          <Box paddingLeft={"10px"}>
            <TextField
              type="password"
              label="Github Token"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setGithubToken(event.target.value);
              }}
            ></TextField>
          </Box>
        </Toolbar>
      </AppBar>
  );
};

export default NavBar;
