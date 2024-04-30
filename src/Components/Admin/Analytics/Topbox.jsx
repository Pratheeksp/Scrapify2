import { Box, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../config/firebase";

//total sales (later) , total users  , total orders , payout balance
const Topbox = () => {
  const [balance, setBalance] = useState(null);
  const [userCount, setUserCount] = useState();
  const [pickupCount, setPickupCount] = useState();
  const [totalSales, setTotalSales] = useState(0);

  //fetch total Sales

  useEffect(() => {
    const fetchTotalSales = async () => {
      try {
        const paymentDocRef = collection(db, "payment");
        const querySnapshot = await getDocs(paymentDocRef);
        let totalAmount = 0;

        querySnapshot.forEach((doc) => {
          const paymentData = doc.data();
          totalAmount += paymentData.amount; //  'amountt is the key for the amount
        });
        console.log("total sales", totalAmount);
        setTotalSales(totalAmount);
      } catch (err) {
        console.error("Error fetching total sales:", err);
      }
    };
    fetchTotalSales();
  }, []);

  //fetch User Count
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const userCollectionRef = collection(db, "users");
        const querySnapshot = await getDocs(userCollectionRef);
        setUserCount(querySnapshot.size);
        console.log("User count", querySnapshot.size);
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };

    fetchUserCount();
  }, []);

  //  fetch balance
  useEffect(() => {
    const fetchBal = async () => {
      try {
        const balanceResponse = await axios.get(
          "https://scrapify-pay.onrender.com/getBalance"
        );
        setBalance(balanceResponse.data.items[0].balance / 100);
        console.log("Balance:", balanceResponse.data.items[0].balance / 100);
      } catch (err) {
        console.error("Error fetching balance:", err.message);
      }
    };
    fetchBal();
  }, []);

  //fetch Order Count
  useEffect(() => {
    const fetchPickupCount = async () => {
      try {
        const pickupDocRef = collection(db, "pickups");

        const querySnapshot = await getDocs(pickupDocRef);
        setPickupCount(querySnapshot.size);
        console.log("Pickup Count", querySnapshot.size);
      } catch (err) {
        console.error("Error fetching pickup count:", err);
      }
    };
    fetchPickupCount();
  }, []);

  return (
    <Grid container spacing={2} sx={{}}>
      <Grid item xs={6} sm={3}>
        <Box
          borderRadius={2}
          textAlign="center"
          p={2}
          height={50}
          sx={{ background: "white" }}
        >
          <Typography sx={{ color: "grey" }}>Total sales</Typography>
          <Typography sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            &#x20B9;&nbsp;{totalSales}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Box
          borderRadius={2}
          textAlign="center"
          p={2}
          height={50}
          sx={{ background: "white" }}
        >
          <Typography sx={{ color: "grey" }}>Total users</Typography>
          <Typography sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {userCount}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Box
          borderRadius={2}
          textAlign="center"
          p={2}
          height={50}
          sx={{ background: "white" }}
        >
          <Typography sx={{ color: "grey" }}>Total orders</Typography>
          <Typography sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {pickupCount}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Box
          borderRadius={2}
          textAlign="center"
          p={2}
          height={50}
          sx={{ background: "white" }}
        >
          <Typography sx={{ color: "grey" }}>Pay balance</Typography>
          <Typography sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            &#x20B9;&nbsp;{balance}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Topbox;
