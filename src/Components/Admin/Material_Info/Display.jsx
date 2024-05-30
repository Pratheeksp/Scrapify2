import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";

const Display = ({ id, subcat,newSubCat }) => {
  const [editedPrice, setEditedPrice] = useState(0);
  const [editedIndex, setEditedIndex] = useState(null);
  const [subCategories, setSubCategories] = useState(subcat);

  useEffect(() => {
    setSubCategories(subcat);
  }, [subcat]);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const catRef = doc(db, "categories", id);
        const categoriesSnap = await getDoc(catRef);
        if (categoriesSnap.exists()) {
          const data = categoriesSnap.data();
          setSubCategories(data.subcategories);
        } else {
          console.log("No such document");
        }
      } catch (err) {
        console.log("Error fetching subcategories", err);
      }
    };

    fetchSubCategories();
  }, [id,newSubCat]);

  const handleEditPrice = (index, value) => {
    setEditedIndex(index);
    setEditedPrice(value);
  };

  const handleCancelEdit = () => {
    setEditedPrice(null);
    setEditedIndex(null);
  };

  const onSavePrice = async (index) => {
    try {
      const categoryRef = doc(db, "categories", id);
      const parsedPrice = parseFloat(editedPrice);
      const updatedSubcat = subCategories.map((subcategory, subIndex) => {
        if (subIndex === index) {
          return {
            ...subcategory,
            subCatPrice: parsedPrice,
          };
        }
        return subcategory;
      });
      await updateDoc(categoryRef, {
        subcategories: updatedSubcat,
      });
      setSubCategories(updatedSubcat);
    } catch (error) {
      console.error("Error updating price:", error);
    } finally {
      setEditedPrice(null);
      setEditedIndex(null);
    }
  };

  const handleDelete = async (index) => {
    try {
      const categoryRef = doc(db, "categories", id);
      const updatedSubcat = subCategories.filter((_, subIndex) => subIndex !== index);
      await updateDoc(categoryRef, {
        subcategories: updatedSubcat,
      });
      setSubCategories(updatedSubcat);
    } catch (error) {
      console.error("Error deleting subcategory:", error);
    }
  };

  return (
    <Box sx={{ margin: "1.2rem 0" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h6" align="center">
                  Name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" align="center">
                  Price
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subCategories.map(({ subcat: name, subCatPrice, unit }, index) => (
              <TableRow key={name}>
                <TableCell align="center" width={"40%"}>
                  {name}
                </TableCell>
                <TableCell align="center" width={"60%"}>
                  <FormControl>
                    <TextField
                      value={
                        editedIndex === index
                          ? editedPrice
                          : `${subCatPrice} /${unit}`
                      }
                      variant="outlined"
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
                                  <CheckIcon
                                    fontSize="small"
                                    sx={{ color: "green" }}
                                  />
                                </IconButton>
                                <IconButton
                                  onClick={() => handleCancelEdit()}
                                  size="small"
                                >
                                  <CloseIcon
                                    fontSize="small"
                                    sx={{ color: "red" }}
                                  />
                                </IconButton>
                              </>
                            ) : (
                              <IconButton
                                onClick={() =>
                                  handleEditPrice(index, subCatPrice)
                                }
                                size="small"
                              >
                                <EditIcon
                                  fontSize="small"
                                  sx={{ color: "#1c4be6;" }}
                                />
                              </IconButton>
                            )}
                          </InputAdornment>
                        ),
                      }}
                      onChange={(e) => handleEditPrice(index, e.target.value)}
                    />
                  </FormControl>
                </TableCell>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    height: "5em",
                  }}
                >
                  <DeleteIcon
                    onClick={() => handleDelete(index)}
                    sx={{
                      color: "#FF204E",
                      "&:hover": { cursor: "pointer", color: "#E72929" },
                    }}
                  />
                </Box>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Display;
