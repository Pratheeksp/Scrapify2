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

const PickupBox = ({ setIsOpen, pickupId }) => {
  const [expanded, setExpanded] = useState(false);
  const [expandedMap, setExpandedMap] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleExpandClickMap = () => {
    setExpandedMap(!expandedMap);
  };

  const pickupBox = (
    <Box
      sx={{
        marginTop: "5vh",
        width: expanded ? { md: "30vw", xs: "60vw" } : 200,
      }}
    >
      <Card>
        <CardActions disableSpacing>
          <Box sx={{ height: { md: "4vh" } }}>
            <Typography variant="body2" color="text.secondary">
              Pickup ID:{pickupId} {/* Displaying Pick up Id */}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Type: Metal {/* Displaying Type of metal(ML-part) */}
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
                    Location
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
                      <Map />
                    </Box>
                  </CardContent>
                </Collapse>
              </Card>

              <ItemPhotos />
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
  );

  if (pickupId !== "") {
    return pickupBox;
  } else {
    return null;
  }
};

export default PickupBox;
