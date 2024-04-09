import React from "react";
import Display from "./Display";
import AddScrap from "./AddScrap";
import { Box, useMediaQuery } from "@mui/material";

const Info = ({ id, subCat }) => {
  // Use media query hook to check if the screen size is small
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        marginLeft: { xs: "9%", md: 0 },
      }}
    >
      <AddScrap id={id} />
      <Display id={id} subcat={subCat} />
    </Box>
  );
};

export default Info;
