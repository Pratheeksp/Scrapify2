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
  const [inputUnit, setInputUnit] = useState(0);
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

      const newSubCategory = {
        subcat: inputName,
        subCatPrice: inputPrice,
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
      console.log("Subcategory added to Firestore");
      setInputName("");
      setInputPrice(0);
      setInputUnit(0);
    } catch (error) {
      console.error("Error adding subcategory to Firestore:", error);
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{
        padding: 1,
        overflow: "auto",
        resize: "horizontal",
        margin: "40px 0 ",
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{
            marginBottom: expanded ? "20px" : "0",
            width: { md: "250px", xs: "200px" },
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
        </Stack>
      </CardContent>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent
          sx={{
            marginTop: "10px",
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            width: { md: "250px", xs: "200px" }, //Change the width of the form box
          }}
        >
          <Box sx={{ display: "flex", columnGap: { md: "30px", xs: "20px" } }}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                sx={{ fontSize: isSmallScreen ? "14px" : "16px" }}
                onChange={onNameInput}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Price</FormLabel>
              <Input
                sx={{ fontSize: isSmallScreen ? "14px" : "16px" }}
                onChange={onPriceInput}
              />
            </FormControl>
          </Box>
          <FormControl>
            <FormLabel>Unit</FormLabel>
            <Input
              sx={{ fontSize: isSmallScreen ? "14px" : "16px" }}
              onChange={onUnitInput}
            />
          </FormControl>
          <CardActions>
            <Button variant="solid" color="primary" onClick={onAddSubCat}>
              Save
            </Button>
          </CardActions>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default AddScrap;
