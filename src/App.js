import "./App.css";

import Admin from "./Components/Admin/Admin";
import Vendor from "./Components/Vendor/Vendor";
import SignUp from "./Components/SingUp_In/SingUp";
import { Route, Routes } from "react-router-dom";
import SignIn from "./Components/SingUp_In/SingIn";
import Bill2 from "./Components/Vendor/Bill/Bill";

//following has to be added
import Dashboard from "./Components/Admin/PaymentDashboard/Dashboard";
import VendorTable from "./Components/Admin/Vendor_Info/VendorTable";
import VendorInfo from "./Components/Admin/Vendor_Info/VendorInfo";
import PrevPickup from "./Components/Vendor/PrevPickup/PrevPickup";
import Profile from "./Components/Vendor/VednorProfile/Profile";
import Analytics from "./Components/Admin/Analytics/Analytics";
function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      <Route path="/admin">
        <Route index element={<Analytics />} />
        <Route path="item" element={<Admin />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="vendor_info" element={<VendorTable />} />
        <Route path="vendor_info/:id" element={<VendorInfo />} />
      </Route>

      <Route path="/vendor">
        <Route index element={<Vendor />} />
        <Route path="bill" element={<Bill2 />} />
        <Route path="pickup" element={<PrevPickup />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;
