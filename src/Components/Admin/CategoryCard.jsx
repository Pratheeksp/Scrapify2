import { Card, CardContent, Typography, Grid } from "@mui/material";
import React from "react";

const CategoryCard = ({ category, onClick }) => {
  return (
    <>
      {category.map(({ id, cat, subcategories }) => (
        <Grid item key={id}>
          <Card
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              ":hover": {
                backgroundColor: "lightgray",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                cursor: "pointer",
              },
            }}
            onClick={() => onClick(id, subcategories)}
          >
            <CardContent>
              <Typography>{cat}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </>
  );
};

export default CategoryCard;
