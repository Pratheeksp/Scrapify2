import { Typography, Divider, Box } from "@mui/material";
import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const Navbar_sm = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("vid");
        localStorage.removeItem("vendor_email");
        navigate("/");
      };
  const location = useLocation();
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
          height: "240px",
          borderRadius: "3px",
          position: "absolute",
          top: "55px", // Adjust top position as needed
          backgroundColor: "white",
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
            to={"/vendor/profile"}
            style={{
              color:
                location.pathname === "/vendor/profile" ? "#5356FF" : "#2C4E80",
              textDecoration: "none",
              fontSize: "16px",
            }}
          >
            Profile
          </NavLink>
        </Typography>
        <Divider sx={{ width: "inherit" }} />
        <Typography>
          <NavLink
            to={"/vendor/pickup"}
            style={{
              color:
                location.pathname === "/vendor/pickup" ? "#5356FF" : "#2C4E80",
              textDecoration: "none",
            }}
          >
            Pickups
          </NavLink>
        </Typography>
        <Divider sx={{ width: "inherit" }} />

        <Typography>
          <NavLink
            to={"/vendor"}
            style={{
              color: location.pathname === "/vendor" ? "#5356FF" : "#2C4E80",
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
