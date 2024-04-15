import React, { useState, useEffect } from "react";
import { Box, Typography, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";
import PickupBox from "./PickUp Box/PickupBox";

const theme = createTheme();

const Content = () => {
  const [pickupData, setPickupData] = useState([]); // Store the fetched pickup data
  const vendorId = localStorage.getItem("vid");

  useEffect(() => {
    const fetchPickupData = async () => {
      try {
        const pickupCollectionRef = collection(db, "pickupDoc");

        // Subscribe to real-time updates
        const unsubscribe = onSnapshot(pickupCollectionRef, (querySnapshot) => {
          const updatedPickups = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Filter out pickups reserved by other vendors or already completed transactions
          const availablePickups = updatedPickups.filter((pickup) => {
            return pickup.reservedBy === vendorId || pickup.reservedBy === null;
          });

          setPickupData(availablePickups);
        });

        return () => {
          // Unsubscribe from real-time updates when component unmounts
          unsubscribe();
        };
      } catch (error) {
        console.error("Error fetching pickup data:", error);
      }
    };

    fetchPickupData();
  }, [vendorId]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: { md: "70vw" },
        }}
      >
        <Typography
          variant="h4"
          sx={{ margin: "50px 0 ", alignSelf: "center" }}
        >
          Pickup Request
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {pickupData.map((item) => (
            <Box
              key={item.id} // Use item.id as key
              width={{ xs: "100%", md: "calc(50% - 8px)" }}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <PickupBox pickupId={item.id} data={item} />
            </Box>
          ))}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Content;
