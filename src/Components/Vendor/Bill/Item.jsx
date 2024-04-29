import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import { Box } from "@mui/material";

const Item = ({ amount }) => {


  // Extract all subcategories as an array of strings
  const options = categories.reduce((acc, category) => {
    category.subcategories.forEach((subcat) => {
      acc.push(subcat.subcat);
    });
    return acc;
  }, []);

  const [selectedSubcat, setSelectedSubcat] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [previousTotal, setPreviousTotal] = useState(0);

  const handleOnChange = (event, value) => {
    setSelectedSubcat(value);
  };

  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value, 10);
    const selectedSubcategory = categories
      .flatMap((category) => category.subcategories)
      .find((subcat) => subcat.subcat === selectedSubcat);
    const addedPrice = selectedSubcategory
      ? selectedSubcategory.subCatPrice * newQuantity
      : 0;
    amount(addedPrice - previousTotal);
    setPreviousTotal(addedPrice);
    setQuantity(newQuantity);
  };

  const selectedSubcategory = categories
    .flatMap((category) => category.subcategories)
    .find((subcat) => subcat.subcat === selectedSubcat);

  const price = selectedSubcategory
    ? selectedSubcategory.subCatPrice * quantity
    : 0;

  let quantityPrice = (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        columnGap: "10vw",
        flexDirection: { xs: "column", md: "row" },
        rowGap: { xs: "2vh" },
      }}
    >
      <TextField
        sx={{ width: { md: "10vw", xs: "25vw" } }}
        label="Quantity"
        type="number"
        value={quantity}
        onChange={handleQuantityChange}
        InputProps={{
          endAdornment: <InputAdornment position="end">pcs</InputAdornment>,
        }}
      />
      <TextField
        sx={{ width: { md: "10vw", xs: "25vw" }, fontWeight: "bold" }}
        label="Total Price"
        value={price}
        disabled
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">&#8377;</InputAdornment>
          ),
        }}
      />
    </Box>
  );
  return (
    <Box
      sx={{
        width: "100vw",
        display: "flex",
        columnGap: { md: "10vw", xs: "20vw" },
      }}
    >
      <Autocomplete
        sx={{ width: { md: "15vw", xs: "40vw" } }}
        id="free-solo"
        freeSolo
        options={options}
        onChange={handleOnChange}
        renderInput={(params) => <TextField {...params} label="Item" />}
      />
      {selectedSubcat && quantityPrice}
    </Box>
  );
};

export default Item;
