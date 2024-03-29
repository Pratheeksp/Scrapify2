import React, { useState } from "react";
import {
  Box,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const Display = ({ id, subcat }) => {
  const [editedPrice, setEditedPrice] = useState(null);
  const [editedIndex, setEditedIndex] = useState(null);

  const handleEditPrice = (index, value) => {
    setEditedIndex(index);
    setEditedPrice(value); // Update editedPrice when editing
  };

  const onSavePrice = (index) => {
    // Here, you can handle saving the edited price
    console.log("Edited Price:", editedPrice);
    // Reset edited price and index after saving

    //save to DB
    setEditedPrice(null);
    setEditedIndex(null);
  };

  return (
    <Box sx={{ margin: "1.2rem 0" }}>
      <Grid container spacing={2} justifyContent="space-evenly">
        <Grid item xs={6} md={4}>
          <Typography variant="h6" align="center">
            Name
          </Typography>
        </Grid>
        <Grid item xs={6} md={4}>
          <Typography variant="h6" align="center">
            Price
          </Typography>
        </Grid>
      </Grid>
      <Divider sx={{ margin: "1rem 0" }} />
      {subcat.map(({ subcat: name, subCatPrice }, index) => (
        <Grid
          key={name}
          container
          justifyContent="space-evenly"
          alignItems="center"
          margin="2vh 0"
          textAlign="center"
          fontSize="14px"
        >
          <Grid item xs={6} md={4}>
            <Typography>{name}</Typography>
          </Grid>
          <Grid item xs={6} md={4}>
            <FormControl>
              <TextField
                value={editedIndex === index ? editedPrice : subCatPrice}
                variant="outlined"
                inputProps={{
                  style: { fontSize: "14px" },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₹</InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      {editedIndex === index ? (
                        <IconButton
                          onClick={() => onSavePrice(index)}
                          size="small"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
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
          </Grid>
        </Grid>
      ))}
    </Box>
  );
};

export default Display;
