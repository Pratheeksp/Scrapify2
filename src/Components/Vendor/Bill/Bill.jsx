import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Divider,
  InputAdornment,
  Autocomplete,
} from "@mui/material";
import { Delete } from "@mui/icons-material";

import PaymentModal from "./PaymentModal";


import { db } from "../../../config/firebase";
import {
  collection,
  getDocs,
  query,


} from "firebase/firestore";

const Bill = () => {
  const [billItems, setBillItems] = useState([]);
  const [subcategoryData, setSubcategoryData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const categoriesCollectionRef = collection(db, "categories");
        const querySnapshot = await getDocs(query(categoriesCollectionRef));

        const subcategories = [];
        querySnapshot.forEach((doc) => {
          const categoryData = doc.data();
          categoryData.subcategories.forEach((subcategory) => {
            subcategories.push({
              subcat: subcategory.subcat,
              subCatPrice: subcategory.subCatPrice,
              unit: subcategory.unit,
            });
          });
        });
        setSubcategoryData(subcategories);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchSubcategories();
  }, []);

  const handleAddItem = () => {
    const newItem = {
      subcat: "",
      quantity: "",
      price: "",
      unit: "",
      tprice: "",
    };
    setBillItems([...billItems, newItem]);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = billItems.map((item, i) => {
      if (i === index) {
        if (field === "subcat") {
          const selectedItem = subcategoryData.find(
            (subcategory) => subcategory.subcat === value
          );
          return {
            ...item,
            [field]: value,
            price: selectedItem.subCatPrice,
            unit: selectedItem.unit, // Add the unit here
            tprice: 0,
          };
        } else if (field === "quantity") {
          const quantity = value !== "" ? Number(value) : ""; // Convert to number if not empty
          return {
            ...item,
            [field]: quantity,
            tprice:
              item.subcat && !isNaN(quantity) ? item.price * quantity : "", // Calculate tprice only if quantity is a number
          };
        }
      }
      return item;
    });
    setBillItems(updatedItems);
  };

  const handleDelete = (index) => {
    const updatedItems = [...billItems];
    updatedItems.splice(index, 1);
    setBillItems(updatedItems);
  };
  const totalPrice = billItems.reduce((total, item) => total + item.tprice, 0);

  const handlePay = () => {
    setIsModalOpen(true); // Open the modal when "Pay" button is clicked
  };

  return (
    <>
      <Box sx={{ margin: "40px 0 " }}>
        <Typography variant="h4" sx={{ textAlign: "center" }}>
          Bill
        </Typography>
        <Divider sx={{ margin: "5vh 0" }} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: { xs: "90vw", sm: "70vw" },
            margin: "auto",
          }}
        >
          {billItems.map((item, index) => (
            <Box key={index} sx={{ display: "flex", gap: 2 }}>
              <Autocomplete
                disablePortal
                disableClearable
                options={subcategoryData.filter(
                  (subcategory) =>
                    !billItems.some(
                      (item) => item.subcat === subcategory.subcat
                    )
                )}
                getOptionLabel={(option) => option.subcat}
                sx={{ flex: 2 }}
                onChange={(e, newValue) =>
                  handleItemChange(
                    index,
                    "subcat",
                    newValue ? newValue.subcat : ""
                  )
                }
                renderInput={(params) => <TextField {...params} />}
              />
              <TextField
                value={item.quantity}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">{item.unit}</InputAdornment>
                  ),
                }}
                onChange={(e) =>
                  handleItemChange(index, "quantity", e.target.value)
                }
                sx={{ flex: 1 }}
              />
              <TextField value={item.tprice} disabled sx={{ flex: 1 }} />
              <Delete onClick={() => handleDelete(index)} sx={{ flex: 0.5 }} />
            </Box>
          ))}

          {billItems.length !== 0 && (
            <>
              <Divider />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Total :</Typography>
                <Typography> &#8377;{totalPrice}</Typography>
              </Box>
              <Divider />
            </>
          )}
          <Button variant="contained" onClick={handleAddItem}>
            Add Item
          </Button>
          <Button variant="outlined" onClick={handlePay}>
            Pay
          </Button>
        </Box>
      </Box>
      {/* Render PaymentModal only when isModalOpen is true */}
      {isModalOpen && (
        <PaymentModal
          totalPrice={totalPrice}
          billItems={billItems}
          onClose={() => setIsModalOpen(false)} // Pass a function to close the modal
        />
      )}
    </>
  );
};

export default Bill;
