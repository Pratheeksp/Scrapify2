import React from "react";
import Display from "./Display";
import AddScrap from "./AddScrap";
import { Grid, useMediaQuery } from "@mui/material";

const Info = ({ id, subCat }) => {
  // Use media query hook to check if the screen size is small
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  return (
    <Grid
      container
      direction="column"
      justifyContent={isSmallScreen ? "center" : "flex-start"}
      alignItems={isSmallScreen ? "center" : "flex-start"}
    >
      <AddScrap id={id} />
      <Display id={id} subcat={subCat} />
    </Grid>
  );
};

export default Info;
