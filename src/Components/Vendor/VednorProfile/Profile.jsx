import { CloudUpload } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
  LinearProgress,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import Navbar from "../Navbar"

import { doc, getDoc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { imgDB, db } from "../../../config/firebase";

function Dialog1({ open1, handleClose, setVendorData, setLoadingData }) {
  const [imageSrc, setImageSrc] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const uploadedImageSrc = reader.result;
        setImageSrc(uploadedImageSrc);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageSrc(null);
  };

  const handleSave = async () => {

    try {
      const storageRef = ref(imgDB, `Imgs2/${uuidv4()}`);
      const imageData = await fetch(imageSrc).then((res) => res.blob());
      await uploadBytes(storageRef, imageData);
      const downloadURL = await getDownloadURL(storageRef);
      console.log("Download URL:", downloadURL);

  
      const vid = localStorage.getItem("vid");
      const vendorDocRef = doc(db, "vendor", vid);
  
      await setDoc(vendorDocRef, { profile: downloadURL }, { merge: true });
      handleClose();
      setLoadingData(true); // Set loading data to true while saving
  
      // Refetch the data after saving
      const updatedVendorDoc = await getDoc(vendorDocRef);
      if (updatedVendorDoc.exists()) {
        const updatedVendorData = updatedVendorDoc.data();
        setVendorData(updatedVendorData);
      } else {
        console.log("Updated vendor document does not exist");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setTimeout(() => {
        setLoadingData(false); 
      },500)// Set loading data back to false after saving
    }
  
  };
  
  

  return (
    <Dialog open={open1} onClose={handleClose}>
      <DialogTitle>Edit Image</DialogTitle>
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
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <label htmlFor="contained-button-file">
          <IconButton component="span">
            <Avatar
              sx={{
                width: { xs: "100px", sm: "200px" },
                height: { xs: "100px", sm: "200px" },
              }}
            >
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt="Uploaded"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <CloudUpload />
              )}
            </Avatar>
          </IconButton>
        </label>
        {imageSrc && (
          <Button variant="outlined" onClick={handleRemoveImage} sx={{ mt: 1 }}>
            Change
          </Button>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function Profile() {

  const [open1, setOpen1] = useState(false);
  const [vendorData, setVendorData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  const handleClose = () => {
    setOpen1(false);
  };

  useEffect(() => {
    const vid = localStorage.getItem("vid");

    if (vid) {
      const getVendorData = async () => {
        try {
          const vendorDocRef = doc(db, "vendor", vid);
          const vendorDoc = await getDoc(vendorDocRef);

          if (vendorDoc.exists()) {
            const vendorData = vendorDoc.data();
            setVendorData(vendorData); // Set vendorData

          } else {
            console.log("Vendor document does not exist");
          }
        } catch (error) {
          console.error("Error fetching vendor data:", error.message);
        } finally {
          setTimeout(() => {
            setLoadingData(false);
          },200)


         // Set loadingData to false after fetching
        }
      };

      getVendorData();
    } else {
      console.log("Vendor VID not found in local storage");
      setLoadingData(false);
    }
  }, []);

  return (
    <>
      <Navbar nav1={"My Pickups"} nav2={"Home"}/>
      {loadingData && <LinearProgress />}
     { !loadingData && <Box
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
            sx={{ width: { xs: "150px", sm: "250px" }, height: {md:"200px",xs:"140px",sm:"180px"} }}
            src={vendorData ? vendorData.profile : "Loading..."}
          ></Avatar>
          <Typography sx={{ m: "2vh 0", fontSize: { xs: "18px", sm: "24px" } }}>
            {vendorData ? vendorData.name : "Loading..."}
          </Typography>
          <Button
            sx={{
              color: "green",
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": { backgroundColor: "transparent" },
            }}
            disableRipple
            onClick={() => setOpen1(true)}
          >
            Change
          </Button>
        </Box>
        <Dialog1
          open1={open1}
          handleClose={handleClose}

          setVendorData={setVendorData} 
          setLoadingData={setLoadingData} 
        />
        <Divider />
        <Box mt={"4vh"} sx={{ }}>
          <Box sx={{ margin: "2vh 0" }}>
            <Box sx={{display:"flex" , justifyContent:"space-between"}}>
              <Typography sx={{ color: "grey" }}>Mobile number</Typography>
              <Typography>
                {vendorData ? vendorData.phone : "Loading..."}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ margin: "2vh 0" }}>
            <Box sx={{display:"flex" , justifyContent:"space-between"}}>
              <Typography sx={{ color: "grey" }}>Email address</Typography>
              <Typography>
                {vendorData ? vendorData.email : "Loading..."}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
}
    </>
  );
}

export default Profile;
