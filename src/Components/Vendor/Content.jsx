import React, { useState, useEffect } from "react";
import { Box, Typography, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { collection, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import PickupBox from "./PickUp Box/PickupBox";

const theme = createTheme();

const Content = () => {
  const [pickupData, setPickupData] = useState([]); // Store the fetched pickup data
  const vendorId = localStorage.getItem("vid");
  const [reservation,setreservation]=useState([]);
  // const [isReserved, setIsReserved] = useState(false);

  useEffect(() => {
    
    const pickupCollectionRef = collection(db, "pickupDoc");
    const reserveCollectionRef = collection(db, "reserve");

    // Subscribe to real-time updates for both pickups and reservations
    const unsubscribePickups = onSnapshot(
      pickupCollectionRef,
      (pickupSnapshot) => {
        const updatedPickups = pickupSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Assuming reserveCollectionRef is your Firebase Firestore collection reference
        onSnapshot(reserveCollectionRef,(reservationSnapshot) => {
          const reservations = reservationSnapshot.docs.map((doc) =>
            doc.data()
          
          );
          setreservation(reservations)
          console.log(vendorId,reservations);
          

          // Filter out pickups reserved by other vendors or already completed transactions
          const availablePickups = updatedPickups.filter((pickup) => {
            const isReservedByOtherVendor = reservations.some(
              (reservation) =>
                reservation.pickupId === pickup.id &&
                reservation.reservedBy !== vendorId
            );
            // setIsReserved(true);
            return !isReservedByOtherVendor;
          });
          
          setPickupData(availablePickups);
        });
      }
    );

    return () => {
      // Unsubscribe from real-time updates when component unmounts
      unsubscribePickups();
      // getdetails();
    };
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
              <PickupBox pickupId={item.id} data={item} reserve={reservation.some((reser)=>reser.pickupId==item.id)}/>
            </Box>
          ))}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Content;
