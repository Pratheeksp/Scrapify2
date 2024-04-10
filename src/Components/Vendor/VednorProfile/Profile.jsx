import { CloudUpload } from "@mui/icons-material";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import Navbar from "../Navbar"

function Dialog1({ open1, handleClose }) {
  const [VendorDetails, setVendorDetails] = useState([]);
  return (
    <>
    <Dialog open={open1} onClose={handleClose}>
      <DialogTitle>Edit Image and Name</DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <input
          accept="image/*"
          id="contained-button-file"
          type="file"
          //   onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <label htmlFor="contained-button-file">
          <IconButton component="span">
            <Avatar
              sx={{
                width: { xs: "100px", sm: "200px", md: "1000px" },
                height: { xs: "100px", sm: "200px", md: "1000px" },
              }}
            >
              <CloudUpload />
            </Avatar>
          </IconButton>
        </label>
        <TextField
          margin="dense"
          id="name"
          label="Name"
          fullWidth
          //   value={name}
          //   onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
}

function Dialog2({ open2, handleClose }) {
  return (
    <Dialog open={open2} onClose={handleClose}>
      <DialogTitle>Edit mobile and email</DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextField
          margin="dense"
          id="name"
          label="Mobile number"
          fullWidth
          //   value={name}
          //   onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          id="name"
          label="Email address"
          fullWidth
          //   value={name}
          //   onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function Profile() {
  const [open1, setopen1] = useState(false);
  const [open2, setopen2] = useState(false);

  const handleClose = () => {
    setopen1(false);
    setopen2(false);
  };
  return (
    <>
    <Navbar nav1={"My Pickups"} nav2={"Home"}/>

      <Box
        sx={{
          width: { xs: "90vw", sm: "80vw", md: "60vw" },
          margin: "5vh auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            margin: "5vh 0",
          }}
        >
          <Avatar
            sx={{ width: { xs: "150px", sm: "250px" }, height: "auto" }}
          ></Avatar>
          <Typography sx={{ m: "2vh 0", fontSize: { xs: "18px", sm: "24px" } }}>
            Rohan
          </Typography>
          <Button
            sx={{
              color: "green",
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": { backgroundColor: "transparent" },
            }}
            disableRipple
            onClick={() => setopen1(true)}
          >
            Change
          </Button>
        </Box>
        <Dialog1 open1={open1} handleClose={handleClose} />
        <Dialog2 open2={open2} handleClose={handleClose} />
        <Divider />
        <Box mt={"4vh"}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              margin: "2vh 0",
            }}
          >
            <Box>
              <Typography sx={{ color: "grey" }}>Mobile number</Typography>
              <Typography>9999999999</Typography>
            </Box>
            <Button
              sx={{
                color: "green",
                fontWeight: "bold",
                textTransform: "none",
                "&:hover": { backgroundColor: "transparent" },
              }}
              disableRipple
              onClick={() => setopen2(true)}
            >
              Change
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              margin: "2vh 0",
            }}
          >
            <Box>
              <Typography sx={{ color: "grey" }}>Email address</Typography>
              <Typography>qwertyu@gmail.com</Typography>
            </Box>
            <Button
              sx={{
                color: "green",
                fontWeight: "bold",
                textTransform: "none",
                "&:hover": { backgroundColor: "transparent" },
              }}
              disableRipple
              onClick={() => setopen2(true)}
            >
              Change
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Profile;
