import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

//assuming I fetch data like from database

const itemsArray = [
  { subcat: "Steel", subCatPrice: 15.5 },
  { subcat: "Aluminum", subCatPrice: 12.75 },
  { subcat: "Copper", subCatPrice: 20.0 },
  { subcat: "Iron", subCatPrice: 10.25 },
  { subcat: "Gold", subCatPrice: 150.0 },
];

const Bill = () => {
  const [billItems, setBillItems] = useState([]);
  const navigate = useNavigate();

  const handleAddItem = () => {
    const newItem = {
      subcat: "",
      quantity: 1,
      price: "",
      tprice: "",
    };
    setBillItems([...billItems, newItem]);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = billItems.map((item, i) => {
      if (i === index) {
        if (field === "subcat") {
          const selectedItem = itemsArray.find((item) => item.subcat === value);
          return {
            ...item,
            [field]: value,
            price: selectedItem.subCatPrice,
            tprice: 0,
          };
        } else if (field === "quantity" && value !== "") {
          const quantity = Number(value);
          console.log(quantity, item);
          return {
            ...item,
            [field]: quantity,
            tprice: item.subcat ? item.price * quantity : "",
          };
        }
      }
      return item;
    });
    setBillItems(updatedItems);
  };

  const handleDelete = (index) => {
    const updatedItems = [...billItems];
    updatedItems.splice(index, 1);
    setBillItems(updatedItems);
  };

  const handlePayment = () => {
    navigate("/payment", { state: { billItems } });
  };

  const totalPrice = billItems.reduce((total, item) => total + item.tprice, 0);

  return (
    <Box>
      <Typography variant="h4" sx={{ textAlign: "center" }}>
        Bill
      </Typography>
      <Divider sx={{ margin: "5vh 0" }} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: { xs: "90vw", sm: "70vw" },
          margin: "auto",
        }}
      >
        {billItems.map((item, index) => (
          <Box key={index} sx={{ display: "flex", gap: 2 }}>
            <Select
              //   label="Item Name"
              value={item.subcat}
              onChange={(e) =>
                handleItemChange(index, "subcat", e.target.value)
              }
              sx={{ flex: 2 }}
            >
              {itemsArray.map((item) => (
                <MenuItem key={item.subcat} value={item.subcat}>
                  {item.subcat}
                </MenuItem>
              ))}
            </Select>
            <TextField
              //  label="Quantity"
              placeholder={item.quantity}
              onChange={(e) =>
                handleItemChange(index, "quantity", e.target.value)
              }
              sx={{ flex: 1 }}
            />
            <TextField
              //   label="Price"
              value={item.tprice}
              disabled
              sx={{ flex: 1 }}
            />
            <Delete onClick={() => handleDelete(index)} sx={{ flex: 0.5 }} />
          </Box>
        ))}
        {billItems.length !== 0 && (
          <>
            <Divider />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Total :</Typography>
              <Typography> &#8377;{totalPrice}</Typography>
            </Box>
            <Divider />
          </>
        )}
        <Button variant="contained" onClick={handleAddItem}>
          Add Item
        </Button>
        <Button variant="outlined" onClick={handlePayment}>
          Pay
        </Button>
      </Box>
    </Box>
  );
};

export default Bill;
