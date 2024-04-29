import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Avatar } from "@mui/material";
import Navbar from "../Navbar";
import { db } from "../../../config/firebase";
import { collection, doc, getDoc, getDocs, where } from "firebase/firestore";
import { query } from "firebase/database";

const VendorInfo = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState({});
  const [prevPickup, setPrevPickup] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const vendorDocRef = doc(db, "vendor", id);
        const docSnap = await getDoc(vendorDocRef);
        if (docSnap.exists()) {
          const vendorData = { id: docSnap.id, ...docSnap.data() };
          setVendor(vendorData);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      }
    };

    if (id) {
      fetchVendorData();
    }
  }, [id]);

  useEffect(() => {
    const fetchPrevPickup = async () => {
      try {
        const paymentDocRef = collection(db, "payment");
        const querySnapshot = await getDocs(
          query(paymentDocRef, where("vendorId", "==", id))
        );

        if (!querySnapshot.empty) {
          const pickups = [];
          querySnapshot.forEach((doc) => {
            const pickupData = { id: doc.id, ...doc.data() };
            pickups.push(pickupData);
          });
          setPrevPickup(pickups);
        }
      } catch (err) {
        console.log("Error fetching previous Pickups", err);
      } finally {
        setLoading(false); // Update loading state regardless of success or failure
      }
    };

    if (id) {
      fetchPrevPickup();
    }
  }, [id]);

  return (
    <>
      <Navbar nav1={"item"} nav2={"home"} />
      <Box
        sx={{
          margin: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <Typography
          variant="h6"
          sx={{ margin: "20px", fontSize: { md: "28px", xs: "16px" } }}
        >
          Vendor Details
        </Typography>

        <Box
          sx={{
            display: "flex",
          }}
        >
          <Box sx={{ p: 2, flexGrow: "1", marginLeft: "10px" }}>
            <Typography
              sx={{ lineHeight: 2, fontSize: { md: "18px", xs: "13px" } }}
            >
              Name: {vendor.name}
            </Typography>
            <Typography
              sx={{ lineHeight: 2, fontSize: { md: "18px", xs: "13px" } }}
            >
              Email: {vendor.email}
            </Typography>
            <Typography
              sx={{ lineHeight: 2, fontSize: { md: "18px ", xs: "13px" } }}
            >
              Contact: {vendor.phone}
            </Typography>
          </Box>
          <Box sx={{ flexGrow: "3", display: "flex" }}>
            <Avatar
              alt="Remy Sharp"
              src={vendor.profile}
              sx={{
                width: { md: 140, xs: 80 },
                height: { md: 140, xs: 80 },
                alignSelf: "center",
              }}
            />
          </Box>
        </Box>

        <Typography
          variant="h6"
          sx={{ margin: "20px", fontSize: { md: "18px", xs: "16px" } }}
        >
          Previous Pickups
        </Typography>
        {loading ? (
          <Typography sx={{ fontWeight: "bold", margin: "10px 30px" }}>
            Loading...
          </Typography>
        ) : prevPickup.length === 0 ? (
          <Typography sx={{ fontWeight: "bold", margin: "10px 30px" }}>
            No Previous Pickup
          </Typography>
        ) : (
          <TableContainer
            component={Paper}
            sx={{ margin: "20px", width: { md: "80%", xs: "90%" } }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Payment ID</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Payment Mode</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {prevPickup.map((pickup) => (
                  <TableRow key={pickup.id}>
                    <TableCell>
                      {new Date(pickup.date.toDate()).toLocaleString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </TableCell>
                    <TableCell>{pickup.pickupId}</TableCell>
                    <TableCell>{pickup.id}</TableCell>
                    <TableCell>{pickup.amount}</TableCell>
                    <TableCell>{pickup.mode}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </>
  );
};

export default VendorInfo;
