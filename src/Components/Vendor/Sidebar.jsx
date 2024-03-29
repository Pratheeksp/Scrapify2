import React from "react";
import { Box } from "@mui/material";

const Sidebar = () => {
  return (
    <Box
      flex={0.2}
      marginRight={2}
      p={2}
      height={"100vh"}
      sx={{ display: { xs: "none", sm: "block" } }}
    ></Box>
  );
};

export default Sidebar;
