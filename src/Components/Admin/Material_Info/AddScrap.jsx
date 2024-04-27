import {
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  FormLabel,
  Input,
  Typography,
  useMediaQuery,
  Collapse,
  Stack,
  Box,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../config/firebase";

const AddScrap = ({ id }) => {
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const [expanded, setExpanded] = useState(false); //to manage the dropdown of add scrap
  const [inputName, setInputName] = useState("");
  const [inputPrice, setInputPrice] = useState(0);
  const [inputUnit, setInputUnit] = useState("");

  const dummydata = [
    { subcat: "PET", subCatPrice: 2, unit: "kg" },
    { subcat: "HDPE", subCatPrice: 3, unit: "kg" },
    { subcat: "LDPE", subCatPrice: 4, unit: "kg" },
    { subcat: "PP", subCatPrice: 5, unit: "kg" },
    { subcat: "PVC", subCatPrice: 1, unit: "kg" },
  ];

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const onNameInput = (e) => {
    setInputName(e.target.value);
  };
  const onPriceInput = (e) => {
    setInputPrice(e.target.value);
  };
  const onUnitInput = (e) => {
    setInputUnit(e.target.value);
  };

  const onAddSubCat = async () => {
    try {
      const categoryDocRef = doc(db, "categories", id);

      const categoryDocSnap = await getDoc(categoryDocRef);
      const categoryData = categoryDocSnap.data();

      // const newSubCategory = {
      //   subcat: inputName,
      //   subCatPrice: inputPrice,
      //   unit: inputUnit,
      // };

      const updatedSubCategories = [
        ...categoryData.subcategories,
        // newSubCategory,
        ...dummydata,
      ];

      await setDoc(categoryDocRef, {
        ...categoryData,
        subcategories: updatedSubCategories,
      });
      console.log("Subcategory added to Firestore");
      setInputName("");
      setInputPrice(0);
      setInputUnit("");
    } catch (error) {
      console.error("Error adding subcategory to Firestore:", error);
    }
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          padding: 1,
          overflow: "auto",
          resize: "horizontal",
          margin: "40px 0 ",
          width: { xs: "250px", md: "600px" },
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
                marginLeft: "10px",
                fontSize: isSmallScreen ? "16px" : "24px",
              }}
              level="title-lg"
            >
              Add New Scrap
            </Typography>
            {isSmallScreen ? (
              <CardActions>
                {expanded ? (
                  <RemoveIcon
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="hide details"
                  />
                ) : (
                  <AddIcon
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show details"
                  />
                )}
              </CardActions>
            ) : null}
          </Box>
        </CardContent>

        {isSmallScreen ? (
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent
              sx={{
                marginTop: "10px",
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                width: { md: "10%" }, // Width of expanded BOX for smaller screen
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  columnGap: "30px",
                }}
              >
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                    sx={{
                      fontSize: "14px",
                      width: { md: "50%" },
                      md: { flexGrow: 1 },
                    }}
                    onChange={onNameInput}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Price</FormLabel>
                  <Input
                    sx={{
                      fontSize: "14px",
                      width: { xs: "90%" },

                      md: { flexGrow: 1 },
                    }}
                    onChange={onPriceInput}
                  />
                </FormControl>
              </Box>
              <FormControl>
                <FormLabel>Unit</FormLabel>
                <Input
                  sx={{
                    fontSize: "14px",
                    width: { xs: "90%", md: "90%" },
                  }}
                  onChange={onUnitInput}
                />
              </FormControl>
              <CardActions>
                <Button
                  variant="solid"
                  sx={{
                    color: "#4793AF",
                    ":hover": {
                      color: "white",
                      backgroundColor: "#4793AF",
                    },
                  }}
                  onClick={onAddSubCat}
                >
                  Save
                </Button>
              </CardActions>
            </CardContent>
          </Collapse>
        ) : (
          <CardContent>
            <Box
              sx={{
                marginTop: "10px",
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                // Width of the  expanded box for lager screen
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  marginLeft: "10px",
                  columnGap: "10px",
                  width: "100%",
                }}
              >
                <FormControl>
                  <TextField
                    sx={{ fontSize: "16px", flex: 1 }}
                    onChange={onNameInput}
                    label="Subcat"
                  />
                </FormControl>
                <FormControl>
                  <TextField
                    sx={{ fontSize: "16px", flex: 1 }}
                    onChange={onPriceInput}
                    label="Price"
                  />
                </FormControl>
              </Box>
              <FormControl sx={{ marginLeft: "10px" }}>
                <TextField
                  sx={{ fontSize: "16px" }}
                  onChange={onUnitInput}
                  label="Unit"
                />
              </FormControl>
              <CardActions>
                <Button
                  variant="solid"
                  sx={{
                    color: "#4793AF",
                    ":hover": {
                      color: "white",
                      backgroundColor: "#4793AF",
                    },
                  }}
                  onClick={onAddSubCat}
                >
                  Save
                </Button>
              </CardActions>
            </Box>
          </CardContent>
        )}
      </Card>
    </>
  );
};

export default AddScrap;
