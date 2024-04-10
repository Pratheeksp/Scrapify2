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
import Modal from "./Modal";


import { db } from "../../../config/firebase";
import { useEffect } from "react";

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

const PickupBox = ({  pickupId, data }) => {
  const [expanded, setExpanded] = useState(false);
  const [expandedMap, setExpandedMap] = useState(false);
  const [isOpen, setIsOpen] = useState(false); //Handling Modal


  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleExpandClickMap = () => {
    setExpandedMap(!expandedMap);
  };

  const pickupBox = (
    <>
     <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        pickupID={data.id}
        dbOtp={data.otp}
        email={data.email}
      />
    <Box
      sx={{
        marginTop: "5vh",
        width: expanded ? { md: "30vw", xs: "70vw" } : 200,
      }}
    >
      <Card>
        <CardActions disableSpacing>
          <Box sx={{ height: { md: "3vh" } }}>
            <Typography variant="body2" color="text.secondary">
              Pickup ID:{pickupId.substring(0, 2)} {/* Displaying Pick up Id */}
            </Typography>
            {/* <Typography variant="body2" color="text.secondary"> */}
            {/* Type: Metal    Displaying Type of metal(ML-part) */}
            {/* </Typography> */}
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

              <ItemPhotos photoLink={data.images}/>
              <Box>
                <Button
                  sx={{ margin: "2vh  0" }}
                  onClick={() => setIsOpen(true)}
                >
                  Take the pickup
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Collapse>
      </Card>
    </Box>
    </>
    
  );

  // if (pickupId !== "") {
  //   return pickupBox;
  // } else {
  //   return null;
  // }
  return pickupBox;
};

export default PickupBox;
