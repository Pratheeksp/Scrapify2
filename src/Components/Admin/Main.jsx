import { Box } from "@mui/material";
import React, { useState } from "react";
import CategoryList from "./CategoryList";
import Info from "./Material_Info/Info";
import Divider from "@mui/material/Divider";

const Main = () => {
  const [selectedSubCat, setSelectedSubCat] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const onClickCat = (id, subCat) => {
    setSelectedId(id);
    setSelectedSubCat(subCat);
  };
  return (
    <Box flexGrow={1} p={4} marginLeft={"20%"}>
      <CategoryList onClick={onClickCat} />
      <Divider sx={{ margin: "40px 0" }} />
      {selectedSubCat && <Info id={selectedId} subCat={selectedSubCat} />}
    </Box>
  );
};

export default Main;
