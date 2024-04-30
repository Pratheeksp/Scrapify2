import { Box } from "@mui/material";
import React from "react";
import NavBar from "../Navbar";
import Charts from "./Charts";
import Dashboard from "../PaymentDashboard/Dashboard";
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
      <NavBar nav1={"item"} nav2={"vendors"} />

      <Box
        sx={{
          padding: "5vh 2vw",
          background: "rgba(211, 211, 211, 0.4);",
          height: "100%",
        }}
      >
        <Topbox />
        <Charts />
        <Dashboard />
      </Box>
    </Box>
  );
};

export default Analytics;
