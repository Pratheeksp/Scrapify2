import React, { useState } from "react";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import ReactDom from "react-dom";

import { useNavigate } from "react-router-dom";
// import Otp from "./Otp"; // Import the updated Otp component
import { MuiOtpInput } from "mui-one-time-password-input";

const modalStyles = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#fff",
  padding: "50px",
  zIndex: 1000,
  borderRadius: "5px",
};

const overlayStyles = {
  position: "fixed",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  backgroundColor: "rgba(0,0,0,0.7)",
  zIndex: 1000,
};

const Modal = ({ open, onClose, pickupID, dbOtp,email }) => {
  const [otp, setOtp] = useState("");
  const [isIncorrect, setIsIncorrect] = useState(false); // State for incorrect OTP
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  if (!open) return null;

  const handleChange = (e) => {
    setOtp(e);
  };

  const onSubmitOTP = () => {
    try {
  
  
      // Convert both OTPs to strings for accurate comparison
      const dbOtpString = String(dbOtp);
      const enteredOtpString = String(otp);
  
      if (dbOtpString === enteredOtpString) {
        navigate("/vendor/bill", { state: { email :email,pickupId:pickupID} });
      } else {
        setIsIncorrect(true); // Set state to indicate incorrect OTP
      }
    } catch (err) {
      console.error("Error comparing OTPs:", err);
    }
  };
  return ReactDom.createPortal(
    <>
      <Box sx={overlayStyles} onClick={onClose} />
      <Box
        sx={{
          ...modalStyles,
          top: isMobile ? "50%" : modalStyles.top,
          left: isMobile ? "50%" : modalStyles.left,
          transform: isMobile ? "translate(-50%, -50%)" : modalStyles.transform,
          maxWidth: 250,
        }}
      >
        <Typography sx={{ fontWeight: "bold" }}>
          Pickup Id: {pickupID.substring(0,2)}
        </Typography>
        <Typography sx={{ marginBottom: "2vh" }}> Enter The OTP </Typography>

        {/* Pass isIncorrect state to the Otp component */}
        <Box>
          <MuiOtpInput
            value={otp}
            onChange={handleChange}
            containerStyle={{
              display: "flex",
              justifyContent: "center",
              gap: "5px",
            }}
            inputStyle={{
              width: "40px",
              height: "40px",
              borderRadius: "5px",
              border: isIncorrect ? "2px solid red" : "1px solid #ccc",
              textAlign: "center",
              fontSize: "16px",
            }}
          />
        </Box>

        {isIncorrect && (
          <Typography variant="body2" color="error">
            Incorrect OTP
          </Typography>
        )}

        <Button sx={{ margin: "1vh 0" }} onClick={onSubmitOTP}>
          Submit
        </Button>
        <Button sx={{ margin: "1vh 0" }} onClick={onClose}>
          Close
        </Button>
      </Box>
    </>,
    document.getElementById("portal")
  );
};

export default Modal;
