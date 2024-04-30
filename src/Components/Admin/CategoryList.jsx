import { Box, Card, CardHeader, FormControl, FormLabel, IconButton, Input } from "@mui/material";
import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import CategoryCard from "./CategoryCard";
import { v4 as uuidv4 } from "uuid";
import { collection, setDoc, getDocs, doc } from "firebase/firestore";
import { db } from "../../config/firebase";

const CategoryList = ({ onClick }) => {
  const [categories, setCategories] = useState([]);
  const [input, setInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const loadedCategories = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(loadedCategories);
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
      <Box sx={{ marginBottom: "3vh" }}>
        <Card elevation={1}>
          <CardHeader title="Add Category" />
          <Box sx={{ display: "flex", alignItems: "center", padding: "1rem" }}>
            <FormControl>
              <FormLabel sx={{ fontWeight: "bold" }}>Material:</FormLabel>
              <Input
                placeholder="Type in here…"
                variant="outlined"
                onChange={onMaterialInput}
                value={input}
              />
            </FormControl>
            <Box ml={2}>
              <IconButton
                onClick={onAddCategory}
                sx={{
                  ":hover": {
                    backgroundColor: "#5BBCFF",
                    borderRadius: "50px",
                    color: "white",
                  },
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Box>
        </Card>
      </Box>
      <Box sx={{ display: "flex",flexWrap:"wrap" }}>
        <CategoryCard category={categories} onClick={onSelectCategory} selectedCategory={selectedCategory} />
      </Box>
    </Box>
  );
};

export default CategoryList;
