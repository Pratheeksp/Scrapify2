import { Box, Grid } from "@mui/material";

import Content from "./Content";
import Navbar from "./Navbar";

const Vendor = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Navbar nav1={"My Pickups"} nav2={"My Profile"} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",

          height: "100vh", // Set the height to 100% of the viewport height for vertical centering
        }}
      >
        <Box>
          <Content />
        </Box>
      </Box>
    </Box>
  );
};

export default Vendor;
