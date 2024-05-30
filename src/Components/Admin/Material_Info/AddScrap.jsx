import {
  Button,
  FormControl,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
} from "@mui/material";

import React, { useState } from "react";
import { getDoc, setDoc, doc } from "firebase/firestore";
import { db } from "../../../config/firebase";

const AddScrap = ({ id, onAddSubCategory }) => {
  const [inputName, setInputName] = useState("");
  const [inputPrice, setInputPrice] = useState("");
  const [inputUnit, setInputUnit] = useState("");
  const [errors, setErrors] = useState({});

  const onNameInput = (e) => {
    setInputName(e.target.value);
  };
  const onPriceInput = (e) => {
    setInputPrice(e.target.value);
  };
  const onUnitInput = (e) => {
    setInputUnit(e.target.value);
  };

  const validateInputs = () => {
    let tempErrors = {};
    if (!inputName) tempErrors.name = "Name is required";
    if (!inputPrice) {
      tempErrors.price = "Price is required";
    } else if (isNaN(inputPrice) || parseFloat(inputPrice) <= 0) {
      tempErrors.price = "Price must be a positive number";
    }
    if (!inputUnit) tempErrors.unit = "Unit is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const onAddSubCat = async () => {
    if (!validateInputs()) return;

    try {
      const categoryDocRef = doc(db, "categories", id);
      const categoryDocSnap = await getDoc(categoryDocRef);
      const categoryData = categoryDocSnap.data();

      const newSubCategory = {
        subcat: inputName,
        subCatPrice: parseFloat(inputPrice), // Ensure price is a number
        unit: inputUnit,
      };

      const updatedSubCategories = [
        ...categoryData.subcategories,
        newSubCategory,
      ];

      await setDoc(categoryDocRef, {
        ...categoryData,
        subcategories: updatedSubCategories,
      });

      setInputName("");
      setInputPrice("");
      setInputUnit("");
      setErrors({});
      onAddSubCategory(newSubCategory);
    } catch (error) {
      console.error("Error adding subcategory to Firestore:", error);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "rgba(173, 216, 230, 0.2)",
        minHeight: "35vh",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        sx={{
          flex: 1,
          fontWeight: "bold",
          textAlign: "center",
          fontSize: "1.2rem",
          display: "flex",
          alignItems: "center",
          alignContent: "center",
          width: "100%",
          justifyContent: "center",
          backgroundColor: "rgba(173, 216, 230, 0.8)",
          borderRadius: "15px 15px  0 0",
        }}
        level="title-lg"
      >
        Add New Scrap
      </Typography>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <TextField
          label="Name"
          value={inputName}
          onChange={onNameInput}
          error={!!errors.name}
          helperText={errors.name}
          sx={{
            width: { xs: "90%", sm: "70%" },

          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          padding: { xs: "0 5%", sm: "0 15%" },
          alignItems: "center",
          alignContent: "center",
          justifyContent: "space-between",
        }}
      >
        <TextField
          label="Price"
          value={inputPrice !== 0 ? inputPrice : ""}
          onChange={onPriceInput}
          error={!!errors.price}
          helperText={errors.price}
          sx={{
            width: "55%",

          }}
        />
        <FormControl sx={{ width: "40%" }} error={!!errors.unit}>
          <InputLabel>Unit</InputLabel>
          <Select
            onChange={onUnitInput}
            label="Unit"
            value={inputUnit}

          >
            <MenuItem value="kg">kg</MenuItem>
            <MenuItem value="g">g</MenuItem>
            <MenuItem value="unit">unit</MenuItem>
          </Select>
          {!!errors.unit && (
            <FormHelperText>{errors.unit}</FormHelperText>
          )}
        </FormControl>
      </Box>

      <Box
        sx={{
          flex: 1,
          padding: { xs: "0 5%", sm: "0 15%" },
          display: "flex",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <Button
          sx={{ width: "100%" }}
          onClick={onAddSubCat}
          variant="contained"
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default AddScrap;
