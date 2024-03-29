import { Box, Grid } from "@mui/material";
import React, { useState } from "react";
import PickupReq from "./PickupReq";
import PickupBox from "./PickUp Box/PickupBox";
import { ThemeProvider } from "@mui/system";
import { createTheme } from "@mui/material/styles";
import Modal from "./PickUp Box/Modal";

const theme = createTheme();

const Main = () => {
  const [isOpen, setIsOpen] = useState(false); //Handling Modal
  const [pickupID, setPickupID] = useState(""); //  manage pickupID

  const onClickModal = (val) => {
    setIsOpen(val); //to manage the modal
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          marginLeft: { md: "8vh" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          // alignItems: "center",
          width: "200%",
        }}
      >
        <PickupReq
          pickupId={(id) => {
            setPickupID(id); // Set pickupID, Id  the vendor hay typed in search bar
          }}
        />

        <Grid container spacing={2} sx={{ width: "100%" }}>
          {[1, 2, 3, 4, 5].map((item) => (
            <Grid key={item} item xs={12} md={6}>
              <Box sx={{ marginBottom: 2 }}>
                <PickupBox pickupId={pickupID} setIsOpen={onClickModal} />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        pickupID={pickupID}
      />
    </ThemeProvider>
  );
};

export default Main;
