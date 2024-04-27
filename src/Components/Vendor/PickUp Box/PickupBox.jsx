import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  IconButton,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styled from "@emotion/styled";
import Map from "./Map";
import ItemPhotos from "./ItemPhotos";
import Modal from "@mui/material/Modal";
import BillModal from "./Modal";
import { db } from "../../../config/firebase";
import { collection, addDoc } from "firebase/firestore";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const PickupBox = ({
  pickupId,
  data,
  reserve,
  reservationCount,
  setReservationCount,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [expandedMap, setExpandedMap] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Handling OTP Modal
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleReserve = async () => {
    if (parseInt(localStorage.getItem("reservationCount")) >= 1) {
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
      setReservationCount(reservationCount + 1);
      localStorage.setItem("reservationCount", "1");
    } catch (error) {
      console.error("Error reserving pickup:", error);
    }
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleExpandClickMap = () => {
    setExpandedMap(!expandedMap);
  };

  // Define the style object for the error modal
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",

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
        // sx={{ width: { md: "40%", xs: "40%" } }}
        onClose={() => setShowErrorModal(false)}
        aria-labelledby="error-modal-title"
        aria-describedby="error-modal-description"
      >
        <Box sx={{ ...style }}>
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
          width: { md: "30vw", xs: "70vw" },
        }}
      >
        <Card
          sx={{
            boxShadow: reserve
              ? "0px 4px 8px rgba(0, 0, 255, 0.2)"
              : "0px 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <CardActions disableSpacing>
            <Box sx={{ height: { md: "3vh" } }}>
              <Typography
                variant="body2"
                color={reserve ? "primary.light" : "text.secondary"}
              >
                Pickup ID: {pickupId}
                Reserve :{reserve.toString()}
              </Typography>
            </Box>
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>

          <Collapse
            in={expanded}
            timeout={{ enter: 400, exit: 200 }}
            unmountOnExit
          >
            <CardContent>
              <Box sx={{ height: expandedMap ? "70vh" : "40vh" }}>
                <Card elevation={3}>
                  <CardActions disableSpacing>
                    <Typography variant="body2" color="text.secondary">
                      {data.address.addressLine2}
                    </Typography>
                    <ExpandMore
                      expand={expandedMap}
                      onClick={handleExpandClickMap}
                      aria-expanded={expandedMap}
                      aria-label="show more"
                    >
                      <ExpandMoreIcon />
                    </ExpandMore>
                  </CardActions>
                  <Collapse
                    in={expandedMap}
                    timeout={{ enter: 300, exit: 200 }}
                    unmountOnExit
                  >
                    <CardContent>
                      <Box sx={{ height: "30vh" }}>
                        <Map
                          location={{
                            latitude: data.latitude,
                            longitude: data.longitude,
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Collapse>
                </Card>

                <ItemPhotos photoLink={data.images} />
                <Box>
                  {!reserve && (
                    <Button sx={{ margin: "2vh  0" }} onClick={handleReserve}>
                      Reserve
                    </Button>
                  )}
                  {reserve && (
                    <Button
                      sx={{ margin: "2vh  0" }}
                      onClick={() => setIsOpen(true)}
                    >
                      Bill
                    </Button>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Collapse>
        </Card>
      </Box>
    </>
  );
};

export default PickupBox;
