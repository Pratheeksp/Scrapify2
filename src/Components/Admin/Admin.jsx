import { Box } from "@mui/material";

import Main from "./Main";
import Navbar from "./Navbar";

const Admin = () => {
  return (
    <Box>
 <Navbar nav1={"home"} nav2={"vendors"}/>

      <Main />
    </Box>
  );
};

export default Admin;
