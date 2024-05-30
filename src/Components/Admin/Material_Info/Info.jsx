import React, { useState } from "react";
import Display from "./Display";
import AddScrap from "./AddScrap";
import { Box } from "@mui/material";

const Info = ({ id, subCat }) => {

  const [newSubCat, setNewSubCat] = useState();
  const addSubCategory = (newSubCategory) => {
    setNewSubCat([ newSubCategory]);
  };
  return (
    <Box
    // sx={{
    //   display: "flex",
    //   flexDirection: "column",
    //   justifyContent: {
    //     xs: "center",
    //     md: "flex-start",
    //   },
    //   alignItems: {
    //     xs: "center",
    //     md: "flex-start",
    //   },

    // }}
    >
      {/* <AddScrap id={id} /> */}
      <AddScrap id={id} onAddSubCategory={addSubCategory} />

      <Display id={id} subcat={subCat} newSubCat={newSubCat}/>
    </Box>
  );
}; 

export default Info;
