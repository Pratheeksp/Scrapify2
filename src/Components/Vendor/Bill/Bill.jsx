import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  Divider,
  FormControl,
  InputLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  Stack,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import axios from "axios";

import { db } from "../../../config/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  Timestamp,
} from "firebase/firestore";

const itemsArray = [
  { subcat: "Steel", subCatPrice: 15.5 },
  { subcat: "Aluminum", subCatPrice: 12.75 },
  { subcat: "Copper", subCatPrice: 20.0 },
  { subcat: "Iron", subCatPrice: 10.25 },
  { subcat: "Gold", subCatPrice: 150.0 },
];

const Bill = () => {
  const [billItems, setBillItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const location = useLocation();
  const { email, pickupId } = location.state;
  const [customerInfo, setCustomerInfo] = useState({});
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchCustomerId = async () => {
      try {
        const usersCollectionRef = collection(db, "users");
        const querySnapshot = await getDocs(
          query(usersCollectionRef, where("email", "==", email))
        );

        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            setCustomerInfo(doc.data());
            setUserId(doc.id);
          });
        } else {
          console.log("No matching user found!");
        }
      } catch (err) {
        console.error("Error fetching user document:", err);
      }
    };

    fetchCustomerId();
  }, [email]);

  const handleAddItem = () => {
    const newItem = {
      subcat: "",
      quantity: 1,
      price: "",
      tprice: "",
    };
    setBillItems([...billItems, newItem]);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = billItems.map((item, i) => {
      if (i === index) {
        if (field === "subcat") {
          const selectedItem = itemsArray.find((item) => item.subcat === value);
          return {
            ...item,
            [field]: value,
            price: selectedItem.subCatPrice,
            tprice: 0,
          };
        } else if (field === "quantity" && value !== "") {
          const quantity = Number(value);
          console.log(quantity, item);
          return {
            ...item,
            [field]: quantity,
            tprice: item.subcat ? item.price * quantity : "",
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

  const FinalPrice = billItems.reduce((total, item) => total + item.tprice, 0);

  const handlePayment = async () => {
    // Add logic based on payment method (cash or UPI)
    let payId = null;
    try {
      if (paymentMethod === "UPI") {
        const response = await axios.post("http://localhost:8080/payment", {
          amount: FinalPrice,
          from: "onboarding@resend.dev",
          to: email,
          subject: "Scrapify Invoice",
          customerupi: "7829926870@paytm",
          customername: customerInfo.name,
          contact: customerInfo.phone,
          billItems,
          pickupid: pickupId,
        });
        console.log("response", response.data);
        payId = response.data.payId;
        console.log(payId);
      }

      // Update database with payment information
      const vendorId = localStorage.getItem("vid");

      const paymentDocRef = collection(db, "payment");

      const currentDate = new Date();
      const firestoreTimestamp = Timestamp.fromDate(currentDate);

      await addDoc(paymentDocRef, {
        pickupId,
        vendorId,
        userId,
        amount: FinalPrice,
        material_info: billItems,
        paymentId: payId,
        mode: paymentMethod,
        date: firestoreTimestamp,
        status:paymentMethod === "UPI" ? "processing" : "processed"
      });
      console.log("Payment information stored successfully.");
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  return (
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
            <Select
              value={item.subcat}
              onChange={(e) =>
                handleItemChange(index, "subcat", e.target.value)
              }
              sx={{ flex: 2 }}
            >
              {itemsArray.map((item) => (
                <MenuItem key={item.subcat} value={item.subcat}>
                  {item.subcat}
                </MenuItem>
              ))}
            </Select>
            <TextField
              placeholder={item.quantity}
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
        {billItems.length !== 0 && (
          <Box sx={{ display: "flex", columnGap: "20px" }}>
            <Typography sx={{ justifySelf: "center", alignSelf: "center" }}>
              Payment Method:
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                row
                aria-label="payment-method"
                name="payment-method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel value="UPI" control={<Radio />} label="UPI" />
                <FormControlLabel
                  value="CASH"
                  control={<Radio />}
                  label="Cash"
                />
              </RadioGroup>
            </FormControl>
          </Box>
        )}
        <Button variant="outlined" onClick={handlePayment}>
          Pay
        </Button>
      </Box>
    </Box>
  );
};

export default Bill;
