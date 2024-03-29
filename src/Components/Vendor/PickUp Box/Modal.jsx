import React, { useState } from "react";

import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import ReactDom from "react-dom";

import { MuiOtpInput } from "mui-one-time-password-input";
import { useNavigate } from "react-router-dom";

const modalStyles = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)", // Adjusted transform for better centering
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

const Modal = ({ open, onClose, pickupID }) => {
  const [otp, setOtp] = useState(""); // Moved useState to the top level
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  if (!open) return null;

  const onValChange = (e) => {
    setOtp(e);
  };
  const onSubmitOTP = () => {
    try {
      navigate("/vendor/bill");
    } catch (err) {}

    //otp value should be authenticated and if its true navigate to bill page
  };

  return ReactDom.createPortal(
    <>
      <Box sx={overlayStyles} />
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
          Pickup Id: {pickupID}
        </Typography>
        <Typography sx={{ marginBottom: "2vh" }}> Enter The OTP </Typography>

        <MuiOtpInput value={otp} onChange={onValChange} />
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
