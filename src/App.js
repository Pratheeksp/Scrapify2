import "./App.css";

import Admin from "./Components/Admin/Admin";
import Vendor from "./Components/Vendor/Vendor";
import SignUp from "./Components/SingUp_In/SingUp";
import { Route, Routes } from "react-router-dom";
import SignIn from "./Components/SingUp_In/SingIn";
import Bill2 from "./Components/Vendor/Bill/Bill";
import Payment from "./Components/Vendor/Bill/Payment";
//following has to be added
import Dashboard from "./Components/Admin/PaymentDashboard/Dashboard";
import VendorTable from "./Components/Admin/Vendor_Info/VendorTable";
import VendorInfo from "./Components/Admin/Vendor_Info/VendorInfo";
import PrevPickup from "./Components/Vendor/PrevPickup/PrevPickup";
import Profile from "./Components/Vendor/VednorProfile/Profile"
function App() {
  return (
    // <Box sx={{ flexGrow: 1 }}>
    //   <Navbar />
    //   <Grid container>
    //     <Grid item margin={7} xs={4} sx={{ md: { margin: "10000px" } }}>
    //       <Content />
    //     </Grid>
    //   </Grid>
    // </Box>
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/admin/vendor_info" element={<VendorTable />} />
      <Route path="/admin/vendor_info/:id" element={<VendorInfo />} />

      <Route path="/vendor">
        <Route index element={<Vendor />} />
        <Route path="bill" element={<Bill2 />} />
        <Route path="pickup" element={<PrevPickup />} />
        <Route path="profile" element={<Profile />} />

      </Route>
      <Route path="/payment" element={<Payment />} />
    </Routes>
  );
}

export default App;
