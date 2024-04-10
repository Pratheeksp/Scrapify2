import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

const ItemPhotos = ({ photoLink }) => {
  return (
    <ImageList sx={{ width: "100%", height: 160 }} cols={3} rowHeight={164}>
      {photoLink.map((item, index) => (
        <ImageListItem key={index}>
          <img
            srcSet={`${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
            src={`${item}?w=164&h=164&fit=crop&auto=format`}
            alt={`Item ${index + 1}`}
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
};

export default ItemPhotos;
