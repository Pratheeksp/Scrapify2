import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export default function ButtonAppBar({ nav1, nav2 }) {
  const navigate = useNavigate();

  const handleNav1 = () => {
    if (nav1 === "dashboard") {
      navigate("/admin/dashboard");
    } else {
      navigate("/admin");
    }
  };

  const handleNav2 = () => {
    if (nav2 === "vendors") {
      navigate("/admin/vendor_info");
    } else {
      navigate("/admin");
    }
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Scrapify
          </Typography>
          <Button onClick={handleNav1} color="inherit">
            {nav1}
          </Button>
          <Button onClick={handleNav2} color="inherit">
            {nav2}
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
