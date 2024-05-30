import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Map from "./Map";
import ItemPhotos from "./ItemPhotos";
import Modal from "@mui/material/Modal";
import BillModal from "./Modal";
import { db } from "../../../config/firebase";
import { collection, addDoc } from "firebase/firestore";

const PickupBox = ({ pickupId, data, reserve, reservation }) => {
  const [isOpen, setIsOpen] = useState(false); // Handling OTP Modal
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [expandedMap, setExpandedMap] = useState(false); // State for map expansion

  const handleReserve = async () => {
    if (reservation.length >= 1) {
      setShowErrorModal(true);

      setTimeout(() => {
        setShowErrorModal(false); // Close the error modal after timeout
      }, 4000);
      return;
    }

    try {
      const vendorId = localStorage.getItem("vid");
      const pickupRef = collection(db, "reserve");
      await addDoc(pickupRef, {
        pickupId,
        reservedBy: vendorId,
      });
    } catch (error) {
      console.error("Error reserving pickup:", error);
    }
  };

  // style for the error modal
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "8px",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <BillModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        pickupID={data.id}
        dbOtp={data.otp}
        email={data.email}
      />
      <Modal
        open={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        aria-labelledby="error-modal-title"
        aria-describedby="error-modal-description"
      >
        <Box sx={{ ...style, backgroundColor: "#272829", color: "white" }}>
          <Typography variant="h6" component="h2">
            Error
          </Typography>
          <Typography sx={{ mt: 2 }}>
            You have already reserved 1 pickup. You cannot reserve more.
          </Typography>
        </Box>
      </Modal>
      <Box
        sx={{
          marginTop: "5vh",
          width: { md: "30vw", xs: "90vw" },
        }}
      >
        <Card
          sx={{
            borderRadius: "15px",

            boxShadow: reserve
              ? "0px 4px 8px rgba(0, 0, 255, 0.2)"
              : "0px 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <CardContent>
            <Typography
              color="text.secondary"
              fontWeight={"bold"}
              sx={{
                bgcolor: reserve ? "lightblue" : "transparent",
                width: "93%", // Change background color when reserved
                display: "inline-block", // Ensure the background color only applies to the text area
                py: 1, // Add padding for better visual appearance
                px: 2, // Add padding for better visual appearance
                borderRadius: "4px", // Add border radius for better visual appearance
              }}
            >
              {pickupId}
            </Typography>
          </CardContent>
          <CardContent>
            <Box sx={{ height: expandedMap ? "58vh" : "40vh" }}>
              <Card elevation={3}>
                <CardActions disableSpacing>
                  <IconButton
                    aria-expanded={expandedMap}
                    aria-label="show map"
                    onClick={() => setExpandedMap(!expandedMap)}
                  >
                    <ExpandMoreIcon
                      style={{ transform: expandedMap ? "rotate(180deg)" : "" }}
                    />
                  </IconButton>
                  <Typography variant="body2" color="text.secondary">
                    Address
                  </Typography>
                </CardActions>
                {expandedMap && (
                  <CardContent sx={{ height: "38vh" }}>
                    <Box sx={{ height: "68%", width: "100%" }}>
                      <Typography
                        sx={{ fontSize: "12px" }}
                        variant="body1"
                        color="text.secondary"
                        mb={2}
                      >
                        {data.address.addressLine1}
                      </Typography>
                      <Typography
                        sx={{ fontSize: "12px" }}
                        variant="body1"
                        color="text.secondary"
                        mb={2}
                      >
                        {data.address.addressLine2}
                      </Typography>
                      <Typography
                        sx={{ fontSize: "12px" }}
                        variant="body1"
                        color="text.secondary"
                        mb={2}
                      >
                        {data.address.pincode}
                      </Typography>
                      <Map
                        location={{
                          latitude: data.latitude,
                          longitude: data.longitude,
                        }}
                      />
                    </Box>
                  </CardContent>
                )}
              </Card>
              {!expandedMap && <ItemPhotos photoLink={data.images} />}
              <Box>
                {!reserve && (
                  <Button
                    sx={{ margin: "2vh 5%", width: "90%" }}
                    variant="contained"
                    onClick={handleReserve}
                  >
                    Reserve
                  </Button>
                )}
                {reserve && (
                  <Button
                    sx={{ margin: "2vh 5%", width: "90%" }}
                    variant="contained"
                    onClick={() => setIsOpen(true)}
                  >
                    Bill
                  </Button>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default PickupBox;
