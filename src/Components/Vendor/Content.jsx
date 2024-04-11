import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
// import PickupReq from "./PickupReq";
import PickupBox from "./PickUp Box/PickupBox";
import { ThemeProvider } from "@mui/system";
import { createTheme } from "@mui/material/styles";

import { useEffect } from "react";
import { collection } from "firebase/firestore";
import { db } from "../../config/firebase";
import { getDocs } from "firebase/firestore";

const theme = createTheme();

const Main = () => {
  // const [pickupID, setPickupID] = useState(""); //  manage pickupID

  const [pickupData, setPickupData] = useState([]); // Store the fetched pickup data

  useEffect(() => {
    // const fetchPickupData = async () => {
    //   try {
    //     const pickupCollectionRef = collection(db, "pickupDoc");
    //     const querySnapshot = await getDocs(pickupCollectionRef);
    //     const data = querySnapshot.docs.map((doc) => ({
    //       id: doc.id,
    //       ...doc.data(),
    //     }));
    //     setPickupData(data);

    //   } catch (error) {
    //     console.error("Error fetching pickup data:", error);
    //   }
    // };
    const fetchPickupData = async () => {
      try {
        const vendorId = "vendor123"; // Replace with actual vendor ID
        const pickupCollectionRef = collection(db, "pickupDoc");
        const querySnapshot = await getDocs(pickupCollectionRef);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(data);

        // Filter out reserved pickup requests
        const availablePickups = data.filter(
          (pickup) =>
            pickup.reservedBy === null || pickup.reservedBy === vendorId
        );

        setPickupData(availablePickups);
      } catch (error) {
        console.error("Error fetching pickup data:", error);
      }
    };

    fetchPickupData();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: { md: "70vw" },
        }}
      >
        <Typography variant="h4" sx={{ margin: "50px 0 ", alignSelf: "" }}>
          Pickup Request
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            position: "relative",
            right: { md: "100px", xs: "50px" },
          }}
        >
          {pickupData.map((item) => (
            <Box key={item} width={{ xs: "100%", md: "calc(50% - 8px)" }}>
              <PickupBox pickupId={item.id} data={item} />
              {/* mapping the data coming for DB and setting the id for each box from the db  */}
            </Box>
          ))}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Main;
