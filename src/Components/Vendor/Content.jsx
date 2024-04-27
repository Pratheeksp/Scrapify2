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
  const [reservation, setReservation] = useState([]);
  const [reservationCount, setReservationCount] = useState(0);

  useEffect(() => {
    const pickupCollectionRef = collection(db, "pickupDoc");
    const reserveCollectionRef = collection(db, "reserve");

    const unsubscribePickups = onSnapshot(
      pickupCollectionRef,
      (pickupSnapshot) => {
        const updatedPickups = pickupSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        onSnapshot(reserveCollectionRef, (reservationSnapshot) => {
          const reservations = reservationSnapshot.docs.map((doc) =>
            doc.data()
          );
          setReservation(reservations);

          // Count the number of reservations made by the vendor
          const vendorReservations = reservations.filter(
            (reservation) => reservation.reservedBy === vendorId
          );
          setReservationCount(vendorReservations.length);

          const availablePickups = updatedPickups.filter((pickup) => {
            const isReservedByOtherVendor = reservations.some(
              (reservation) =>
                reservation.pickupId === pickup.id &&
                reservation.reservedBy !== vendorId
            );
            return !isReservedByOtherVendor;
          });

          setPickupData(availablePickups);
        });
      }
    );

    return () => {
      unsubscribePickups();
    };
  }, [vendorId]);

  // To filter the data from Db as per our choice
  const reservedPickups = pickupData.filter(
    (item) =>
      reservation.some((reser) => reser.pickupId === item.id) && !item.picked
  );
  const availablePickups = pickupData.filter(
    (item) =>
      !reservation.some((reserve) => reserve.pickupId === item.id) &&
      item.reservedBy !== vendorId &&
      !item.picked
  );

  console.log(reservationCount);
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
          {reservedPickups.map((item) => (
            <Box
              key={item.id}
              width={{ xs: "100%", md: "calc(50% - 8px)" }}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <PickupBox
                pickupId={item.id}
                data={item}
                reserve={true}
                reservationCount={reservationCount}
                setReservationCount={setReservationCount}
              />
            </Box>
          ))}

          {availablePickups.map((item) => (
            <Box
              key={item.id}
              width={{ xs: "100%", md: "calc(50% - 8px)" }}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <PickupBox
                pickupId={item.id}
                data={item}
                reserve={false}
                reservationCount={reservationCount}
                setReservationCount={setReservationCount}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Content;
