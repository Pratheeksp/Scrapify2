import { Box, Grid } from "@mui/material";

import Content from "./Content";
import Navbar from "./Navbar";

const Vendor = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Navbar />
      <Grid container>
        <Grid item xs={4}>
          <Content />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Vendor;
