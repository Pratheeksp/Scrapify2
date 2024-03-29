import React, { useState } from "react";
import { MuiOtpInput } from "mui-one-time-password-input";

const Otp = ({ otpval }) => {
  const [otp, setOtp] = useState("");

  const handleChange = (newValue) => {
    setOtp(newValue); // Authenticate otp
  };

  return <MuiOtpInput value={otp} onChange={handleChange} />;
};

export default Otp;
