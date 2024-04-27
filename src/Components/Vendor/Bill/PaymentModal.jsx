import {
  Box,
  Button,
  Divider,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../../config/firebase";
import ReactDom from "react-dom";

import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  Timestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import axios from "axios";

const PaymentModal = ({ totalPrice, billItems, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [upiId, setUpiId] = useState("@okaysbi"); // Default UPI ID
  const location = useLocation();
  const { email, pickupId } = location.state;
  const [customerInfo, setCustomerInfo] = useState({});
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();

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

  const handlePayment = async () => {
    // Add logic based on payment method (cash or UPI)
    let payId = null;
    try {
      if (paymentMethod === "UPI") {
        const response = await axios.post("http://localhost:8080/payment", {
          amount: totalPrice,
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
        amount: totalPrice,
        material_info: billItems,
        paymentId: payId,
        mode: paymentMethod,
        date: firestoreTimestamp,
        status: paymentMethod === "UPI" ? "processing" : "processed",
      });
      console.log("Payment information stored successfully.");
      const pickupDocRef = doc(db, "pickupDoc", pickupId);
      await updateDoc(pickupDocRef, {
        picked: true,
      });

      onClose(); // Close the modal after payment is processed
      navigate("/vendor");
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  return ReactDom.createPortal(
    <>
      {/* Modal backdrop */}
      <div style={modalBackdropStyle}></div>

      {/* Modal content */}
      <Box style={modalContentStyle} sx={{ width: { md: "40%", xs: "80%" } }}>
        <Box sx={{ maxHeight: {md:"300px",xs:"200px"}, overflowY: "auto" }}>
          <table style={{ width: "90%" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "center", padding: "10px" }}>Item</th>
                <th style={{ textAlign: "center", padding: "10px" }}>
                  Quantity
                </th>
                <th style={{ textAlign: "center", padding: "10px" }}>Price</th>
              </tr>
            </thead>
            <tbody>
              {billItems.map((item, index) => (
                <tr key={index}>
                  <td style={{ textAlign: "center", padding: "10px" }}>
                    {item.subcat}
                  </td>
                  <td style={{ textAlign: "center", padding: "10px" }}>
                    {item.quantity}
                  </td>
                  <td style={{ textAlign: "center", padding: "10px" }}>
                    {item.tprice}
                  </td>
                </tr>
              ))}
              <tr
                style={{
                  borderTop: "2px solid grey",
                  margin: "10px 0",
                  borderBottom: "2px solid grey",
                }}
              >
                <td
                  colSpan="3"
                  style={{
                    textAlign: "center",
                    padding: "10px",
                    fontWeight: "bold",
                    color: "grey",
                  }}
                ></td>
              </tr>
            </tbody>
          </table>
        </Box>
        <Box
          sx={{ display: "flex", columnGap: "4px", justifyContent: "center",margin:"15px 0" }}
        >
          <Typography sx={{ fontWeight: "bold", color: "grey" }}>
            Total:
          </Typography>
          <Typography sx={{ fontWeight: "bold" }}>
            {" "}
            &#x20B9;{totalPrice.toFixed(2)}
          </Typography>
        </Box>
        <Divider style={{ margin: "20px 0" }} />
        <RadioGroup>
          <Typography sx={{ marginBottom: "1.2rem" }}>
            Payment Method :
          </Typography>
          <Box>
            <Box
              sx={{
                border: "2px solid #748DA6",
                borderRadius: "8px",
                padding: "10px",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography>UPI :</Typography>
                <Radio
                  value={"UPI"}
                  checked={paymentMethod === "UPI"}
                  onChange={() => setPaymentMethod("UPI")}
                  sx={{ justifyContent: "center" }}
                />
              </Box>
              <TextField
                label="Enter UPI ID"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                disabled={paymentMethod !== "UPI"}
                style={{ margin: "10px 0" }}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography>Cash:</Typography>
              <Radio
                value={"CASH"}
                checked={paymentMethod === "CASH"}
                onChange={() => setPaymentMethod("CASH")}
              />
            </Box>
          </Box>
        </RadioGroup>
        <Box
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
            columnGap: "30px",
          }}
        >
          <Button
            onClick={handlePayment}
            sx={{
              backgroundColor: "#65B741",
              color: "#FEFAF6",
              "&:hover": {
                backgroundColor: "#2C7865",
                color: "white",
              },
            }}
          >
            Pay
          </Button>
          <Button
            onClick={onClose}
            sx={{
              backgroundColor: "#31363F",
              color: "white",
              "&:hover": {
                backgroundColor: "#000000",
                color: "white",
              },
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </>,
    document.getElementById("payment_modal")
  );
};

export default PaymentModal;

// CSS styles
const modalBackdropStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.9)", // Semi-transparent black
  backdropFilter: "blur(1px)", // Apply blur effect
  zIndex: 9999, // Ensure it appears above everything
};

const modalContentStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { md: "70%", xs: "90%" }, // Adjust the width as needed
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", // Box shadow for depth
  zIndex: 10000, // Ensure it appears above backdrop
};
