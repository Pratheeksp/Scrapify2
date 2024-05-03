import { Box, Grid, Typography } from "@mui/material";
import React from "react";

const CategoryCard = ({ category, onClick, selectedCategory }) => {
  return (
    <Grid container spacing={2} justifyContent="center" >
      {category.map(({ id, cat, subcategories }) => (
        <Grid item xs={6} sm={6} lg={4} key={id}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: id === selectedCategory ? "rgba(173, 216, 230, 0.3)" : "white",
              boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              padding: "1rem",
              ":hover": {
                backgroundColor: "lightgrey",
                cursor: "pointer",
              },
            }}
            onClick={() => onClick(id, subcategories)}
          >
            <Typography>{cat}</Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default CategoryCard;
