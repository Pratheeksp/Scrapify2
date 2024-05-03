import {
  Button,
  // Card,
  // CardActions,
  // CardContent,
  FormControl,
  // FormLabel,
  // Input,
  Typography,
  // useMediaQuery,
  // Collapse,
  Box,
  TextField,
  Select,
  MenuItem,
  // Divider
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";

import React, { useState } from "react";
// import AddIcon from "@mui/icons-material/Add";
// import RemoveIcon from "@mui/icons-material/Remove";

import { getDoc, setDoc, doc } from "firebase/firestore";
import { db } from "../../../config/firebase";

const AddScrap = ({ id }) => {
  // const isSmallScreen = useMediaQuery("(max-width:600px)");
  // const [expanded, setExpanded] = useState(false); //to manage the dropdown of add scrap
  const [inputName, setInputName] = useState("");
  const [inputPrice, setInputPrice] = useState(0);
  const [inputUnit, setInputUnit] = useState("");

  // const handleExpandClick = () => {
  //   setExpanded(!expanded);
  // };

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
      setInputUnit("");
    } catch (error) {
      console.error("Error adding subcategory to Firestore:", error);
    }
  };


  return (
    <Box
      sx={{ backgroundColor: "white", minHeight: "35vh", borderRadius: "10px", display:'flex',flexDirection:'column',backgroundColor:'rgba(173, 216, 230, 0.2)'}}
    >
      <Typography
        sx={{
          flex:1,
          fontWeight: "bold",
          textAlign:'center',
          fontSize:'1.2rem',
          display:'flex',
          alignItems:'center',
          alignContent:'center',
          width:'100%',
          justifyContent:'center',
          backgroundColor:'rgba(173, 216, 230, 0.8)',
          borderRadius:"15px 15px  0 0"
        }}
        level="title-lg"
      
      >
        Add New Scrap
      </Typography>
      <Box
        sx={{flex:1,display:'flex',justifyContent:'center', alignItems:'center',
        alignContent:'center',}}
      >
        <TextField label="Name" onChange={onNameInput} sx={{width:{xs:'90%',sm:'70%'},backgroundColor:'white'}}/>
       </Box>

       <Box sx={{display:'flex',padding:{xs:'0 5%',sm:'0 15%'}, alignItems:'center',
          alignContent:'center',justifyContent:'space-between'}}>
       <TextField label="Price" onChange={onPriceInput} sx={{width:'55%',backgroundColor:'white'}}/>
        <FormControl sx={{width:'40%',backgroundColor:'white'}}>
        <InputLabel>Unit</InputLabel>
        <Select
          onChange={onUnitInput}
          label="Unit"
         
        >
          <MenuItem value="/kg">/kg</MenuItem>
          <MenuItem value="/g">/g</MenuItem>
          <MenuItem value="/unit">/unit</MenuItem>
        </Select>
        </FormControl>
       </Box>

        <Box sx={{flex:'1',padding:{xs:'0 5%',sm:'0 15%'}, display:'flex',alignItems:'center',
          alignContent:'center',}}><Button sx={{width:'100%'}} onClick={onAddSubCat} variant="contained">
          Save
        </Button></Box>
      
      </Box>
    
  );
};

export default AddScrap;
