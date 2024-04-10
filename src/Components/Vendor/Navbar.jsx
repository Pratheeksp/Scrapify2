import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export default function ButtonAppBar({ nav1, nav2 }) {
  const navigate = useNavigate();

  const handleNavigate1 = () => {
    if (nav1 === "My Pickups") {
      navigate("/vendor/pickup");
    } else {
      navigate("/vendor");
    }
  };

  const handleNavigate2 = () => {
    if (nav2 === "My Profile") {
      navigate("/vendor/profile");
    } else {
      navigate("/vendor");
    }
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Scrapify
          </Typography>
          <Button color="inherit" onClick={handleNavigate1}>
            {nav1}
          </Button>
          <Button color="inherit" onClick={handleNavigate2}>
            {nav2}
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
