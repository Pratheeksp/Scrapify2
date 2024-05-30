import { Typography, Divider, Box } from "@mui/material";
import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const Navbar_sm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("adminid");
    localStorage.removeItem("admin_email");
    navigate("/");
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignContent: "flex-start",
          rowGap: "20px",
          padding: "14px",
          left: "0px",
          width: "95%",
          height: "250px",
          borderRadius: "3px",
          position: "absolute",
          top: "55px", // Adjust top position as needed
          backgroundColor: "#FEFFD2",
          animation: "dropIn 0.3s ease-in", // Adjust animation duration
          "@keyframes dropIn": {
            from: {
              opacity: "0.2",
            },
            to: {
              opacity: "1",
            },
          },
        }}
      >
        <Typography>
          <NavLink
            to={"/admin/item"}
            style={{
              color:
                location.pathname === "/admin/item" ? "#5356FF" : "#2C4E80",
              textDecoration: "none",
              fontSize: "16px",
            }}
          >
            Products
          </NavLink>
        </Typography>
        <Divider sx={{ width: "inherit" }} />
        <Typography>
          <NavLink
            to={"/admin/vendor_info"}
            style={{
              color:
                location.pathname === "/admin/vendor_info"
                  ? "#5356FF"
                  : "#2C4E80",
              textDecoration: "none",
            }}
          >
            Vendors
          </NavLink>
        </Typography>
        <Divider sx={{ width: "inherit" }} />

        <Typography>
          <NavLink
            to={"/admin"}
            style={{
              color: location.pathname === "/admin" ? "#5356FF" : "#2C4E80",
              textDecoration: "none",
            }}
          >
            Home
          </NavLink>
        </Typography>
        <Divider sx={{ width: "inherit" }} />
        <Typography>
          <NavLink
            onClick={handleLogout}
            to={"/"}
            style={{
              color: "#2C4E80",
              textDecoration: "none",
            }}
          >
            Logout
          </NavLink>
        </Typography>
        <Divider sx={{ width: "inherit" }} />
      </Box>
    </>
  );
};

export default Navbar_sm;
