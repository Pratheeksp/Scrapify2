import { Box } from "@mui/material";
// import React, { useState } from "react";
import SearchBar from "./SearchBar";

const PickupReq = ({ pickupId }) => {
  const searchQuery = (query) => {
    pickupId(query); // id entered in search bar is sent to Content.jsx
  };

  return (
    <Box>
      <h1>Pickup Request</h1>
      <SearchBar setSearchQuery={searchQuery} />
    </Box>
  );
};

export default PickupReq;
