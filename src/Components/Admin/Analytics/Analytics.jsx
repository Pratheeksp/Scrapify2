import { Box } from "@mui/material";
import React from "react";
import NavBar from "../Navbar";
import Charts from "./Charts";
/* Recent Payments - List (Monthly ),
 Monthly Revenue - bar chart , 
 cat & subcat - pie chart (based on price), 
 Profit by cat - pie Chart ,
  Todays pickup (optional)

  Done :
total orders - number , Balance, */ 

import Topbox from "./Topbox";

const Analytics = () => {
  return (
    <Box>
      <NavBar nav1={"dashboard"} nav2={"vendors"} nav3={"products"} />
      <Box sx={{padding:'5vh 2vw',background:'rgba(211, 211, 211, 0.4);',height:'100vh'}}>
        <Topbox/>
        <Charts/>
      </Box>
    </Box>
  );
};

export default Analytics;
