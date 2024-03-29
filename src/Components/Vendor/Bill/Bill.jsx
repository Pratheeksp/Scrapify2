import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import Item from "./Item";
import AddIcon from "@mui/icons-material/Add";
import Navbar from "../Navbar";

const Bill = () => {
  const [items, setItems] = useState([{ id: 1 }]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showTotalPrice, setShowTotalPrice] = useState(false);

  const handleAddItem = () => {
    const newItem = { id: items.length + 1 };
    setItems([...items, newItem]);
  };

  const onAmountChange = (amount) => {
    setTotalPrice(totalPrice + amount);
  };

  const handleGetPrice = () => {
    setShowTotalPrice(true);
  };

  return (
    <Box>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          rowGap: "5vh",
          marginLeft: { md: 60 },
          marginTop: 3,
        }}
      >
        <Typography>Bill</Typography>
        {items.map((item) => (
          <Box
            key={item.id}
            sx={{
              display: "flex",
              columnGap: "2vw",
              alignItems: { md: "center" },
            }}
          >
            <Typography>{item.id}.</Typography>
            <Item key={item.id} amount={onAmountChange} />
          </Box>
        ))}
        <Box>
          <Button
            sx={{ width: "5vw", marginRight: 4 }}
            variant="contained"
            onClick={handleAddItem}
          >
            <AddIcon />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Bill;
