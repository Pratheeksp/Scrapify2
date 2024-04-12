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
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { db } from "../../../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid"; // Import v4 as uuidv4 alias
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { imgDB } from "../../../config/firebase";
import {useNavigate} from "react-router-dom"

function Dialog1({ open1, handleClose, setProfileImg }) {
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
      const storageRef = ref(imgDB, `Imgs2/${uuidv4()}`); // Use uuidv4 to generate unique ID

      const imageData = await fetch(imageSrc).then((res) => res.blob());
      await uploadBytes(storageRef, imageData);
      const downloadURL = await getDownloadURL(storageRef);
      console.log("Download URL:", downloadURL);
      setProfileImg(downloadURL); // Update profile image URL

      const vid = localStorage.getItem("vid");
      const userDocRef = doc(db, "users", vid);

      // Update profile information in Firestore
      await setDoc(userDocRef, { profile: downloadURL }, { merge: true });
    } catch (error) {
      console.error("Error uploading image:", error);
    }

    handleClose();
  };

  return (
    <Dialog open={open1} onClose={handleClose}>
      <DialogTitle>Edit Image </DialogTitle>
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
  const [profileImg, setProfileImg] = useState(null);
  const [open1, setOpen1] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen1(false);
  };

  useEffect(() => {
    const vid = localStorage.getItem("vid");
    // const vid = "5QEKR2Oyl4WTjpIS1x0PNXXmXl52";

    if (vid) {
      const getUserData = async () => {
        try {
          const userDocRef = doc(db, "vendor", vid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserData(userData);
            setProfileImg(userData.profileImg); // Set profile image URL
          } else {
            console.log("vendor document does not exist");
          }
        } catch (error) {
          console.error("Error fetching vendor data:", error.message);
        }
      };

      getUserData();
    } else {
      console.log("Vendor UID not found in local storage");
    }
  }, []);

  const onLogout = () => {
    localStorage.removeItem("vid");
    localStorage.removeItem("vendor_email");
    navigate("/")
    
  };
  return (
    <>
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
            src={userData ? userData.profile : "Loading..."}
          ></Avatar>
          <Typography sx={{ m: "2vh 0", fontSize: { xs: "18px", sm: "24px" } }}>
            {userData ? userData.name : "Loading..."}
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
          setProfileImg={setProfileImg}
        />
        <Divider />
        <Box mt={"4vh"} sx={{ textAlign: "center" }}>
          <Box sx={{ margin: "2vh 0" }}>
            <Box>
              <Typography sx={{ color: "grey" }}>Mobile number</Typography>
              <Typography>
                {userData ? userData.phone : "Loading..."}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ margin: "2vh 0" }}>
            <Box>
              <Typography sx={{ color: "grey" }}>Email address</Typography>
              <Typography>
                {userData ? userData.email : "Loading..."}
              </Typography>
            </Box>
            <Button onClick={onLogout}>Logout</Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Profile;
