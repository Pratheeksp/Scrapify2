import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import CategoryCard from "./CategoryCard";
import { v4 as uuidv4 } from "uuid";
import { collection, setDoc, getDocs, doc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { Box, Button, FormControl, Input, Typography } from "@mui/material";

const CategoryList = ({ onClick }) => {
  const [categories, setCategories] = useState([]);
  const [input, setInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); // Default to empty string

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const loadedCategories = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(loadedCategories);

        // Set selected category to the ID of the first category card
        if (loadedCategories.length > 0) {
          setSelectedCategory(loadedCategories[0].id);
          // Pass the first category's ID and subcategories to the onClick function
          onClick(loadedCategories[0].id, loadedCategories[0].subcategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const onMaterialInput = (e) => {
    setInput(e.target.value);
  };

  const addCategoryToFirestore = async (newCategory) => {
    try {
      const categoryCollectionRef = doc(db, "categories", newCategory.id);
      await setDoc(categoryCollectionRef, newCategory);
      console.log("Category added to Firestore");
    } catch (error) {
      console.error("Error adding category to Firestore:", error);
    }
  };

  const onAddCategory = () => {
    if (input.trim() !== "") {
      const newCategory = {
        id: uuidv4(),
        cat: input,
        subcategories: [],
        profit: Math.floor(Math.random() * 20),
      };

      setCategories((prevCategories) => [...prevCategories, newCategory]);
      addCategoryToFirestore(newCategory);
      setInput("");
    }
  };

  const onSelectCategory = (id, subCat) => {
    onClick(id, subCat);
    setSelectedCategory(id); // Update selected category
  };

  return (
    <Box sx={{ marginBottom: "3vh" }}>
      <Box
        sx={{
          marginBottom: "3vh",
          backgroundColor: "white",
          borderRadius: "6px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "200px",
          // padding: "10px",
          backgroundColor: "rgba(173, 216, 230, 0.2)",
        }}
      >
        <Box
          sx={{
            flex: 1,
            backgroundColor: "rgba(173, 216, 230, 0.8)",
            width: "100%",
            height: "50%",
            textAlign: "center",
            justifyContent: "center",
            alignContent:"center",
            borderRadius: "15px 15px  0 0",
          }}
        >
          <Typography variant="h6" fontWeight={"bold"}>Add new Category</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "1rem",
            flex: 2,
          }}
        >
          <FormControl>
            <Input
              sx={{ width: { xs: "160px", md: "40vw" } }}
              placeholder="Material"
              variant="outlined"
              onChange={onMaterialInput}
              value={input}
            />
          </FormControl>
          <Button
            onClick={onAddCategory}
            sx={{
              justifyContent: "center",
              color: "black",
              backgroundColor: "#5BBCFF",
              borderRadius: "50px",
              fontWeight: "bold",
              ":hover": {
                backgroundColor: "#CDE8E5",
                color: "black",
              },
            }}
          >
            <AddIcon />
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        <CategoryCard
          category={categories}
          onClick={onSelectCategory}
          selectedCategory={selectedCategory}
        />
      </Box>
    </Box>
  );
};

export default CategoryList;
