import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  Input,
  Stack,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import CategoryCard from "./CategoryCard";
import { v4 as uuidv4 } from "uuid";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

const CategoryList = ({ onClick }) => {
  const [categories, setCategories] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const loadedCategories = [];
        querySnapshot.forEach((doc) => {
          loadedCategories.push(doc.data());
        });
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
      const categoryCollectionRef = collection(db, "categories");
      await addDoc(categoryCollectionRef, newCategory);
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
      };

      setCategories((prevCategories) => [...prevCategories, newCategory]);
      addCategoryToFirestore(newCategory);
      setInput("");
    }
  };

  const onSelectCategory = (id, subCat) => {
    onClick(id, subCat);
  };

  return (
    <Grid container sx={{ marginBottom: "3vh" }} spacing={4}>
      <Grid item>
        <Card elevation={1}>
          <CardHeader title="Add Category" />

          <CardContent>
            <Stack direction="row" alignItems="bottom" spacing={2}>
              <FormControl>
                <FormLabel sx={{ fontWeight: "bold" }}>Material:</FormLabel>
                <Input
                  placeholder="Type in here…"
                  variant="outlined"
                  onChange={onMaterialInput}
                  value={input}
                />
              </FormControl>
              <CardActions>
                <IconButton onClick={onAddCategory}>
                  <AddIcon />
                </IconButton>
              </CardActions>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <CategoryCard category={categories} onClick={onSelectCategory} />
    </Grid>
  );
};

export default CategoryList;
