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
        justifyContent: {
          xs: "center", 
          md: "flex-start", 
        },
        alignItems: {
          xs: "center", 
          md: "flex-start", 
        },


      }}
    >
      <AddScrap id={id} />
      <Display id={id} subcat={subCat} />
    </Box>
  );
};

export default Info;
