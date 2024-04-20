import React, { useState } from "react";
import {
  Box,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

// Importing Firebase related dependencies
import { doc } from "firebase/firestore";
import { updateDoc } from "firebase/firestore";
import { db } from "../../../config/firebase"; // Make sure to import your Firebase configuration

const Display = ({ id, subcat }) => {
  const [editedPrice, setEditedPrice] = useState(0);
  const [editedIndex, setEditedIndex] = useState(null);

  const handleEditPrice = (index, value) => {
    setEditedIndex(index);
    setEditedPrice(value);
  };
  const handleCancelEdit = () => {
    setEditedPrice(null);
    setEditedIndex(null);
  };
console.log(subcat);
const onSavePrice = async (index) => {
  try {
    // Construct the path to the specific category document
    const categoryRef = doc(db, "categories", id);

    // Parse the edited price to a number
    const parsedPrice = parseFloat(editedPrice);

    // Create a new array to hold the updated subcategory data
    const updatedSubcat = subcat.map((subcategory, subIndex) => {
      if (subIndex === index) {
        // If the current index matches the edited index, update the price
        return {
          ...subcategory,
          subCatPrice: parsedPrice,
        };
      } else {
        // Otherwise, return the original subcategory object
        return subcategory;
      }
    });

    // Update the document in the database with the new array of subcategories
    await updateDoc(categoryRef, {
      subcategories: updatedSubcat,
    });

    console.log("Price updated successfully");
    console.log("Price for index", index, "updated to", parsedPrice);
  } catch (error) {
    console.error("Error updating price:", error);
  }

  // Reset edited price and index after saving
  setEditedPrice(null);
  setEditedIndex(null);
};

  return (
    <Box sx={{ margin: "1.2rem 0", display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", flexDirection: "row", columnGap: "6rem" }}>
        <Typography variant="h6" align="center" sx={{ marginBottom: "1rem" }}>
          Name
        </Typography>
        <Typography variant="h6" align="center" sx={{ marginBottom: "1rem" }}>
          Price
        </Typography>
      </Box>

      <Divider sx={{ margin: "1rem 0" }} />
      {subcat.map(({ subcat: name, subCatPrice ,unit}, index) => (
        <Box
          key={name}
          display="flex"
          justifyContent="space-evenly"
          alignItems="center"
          margin="2vh 0"
          textAlign="center"
          fontSize="14px"
          columnGap="6rem"
        >
          <Typography>{name}</Typography>
          <FormControl>
            <TextField
              sx={{ maxWidth: { md: "150px", xs: "130px" } }}
              value={editedIndex === index ? editedPrice : subCatPrice}
              variant="outlined"
              label={unit}
              inputProps={{ style: { fontSize: "14px" } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {editedIndex === index ? (
                      <>
                        <IconButton
                          onClick={() => onSavePrice(index)}
                          size="small"
                        >
                          <CheckIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() => handleCancelEdit(index)}
                          size="small"
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </>
                    ) : (
                      <IconButton
                        onClick={() => handleEditPrice(index, subCatPrice)}
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
              onChange={(e) => handleEditPrice(index, e.target.value)}
            />
          </FormControl>
        </Box>
      ))}
    </Box>
  );
};

export default Display;
