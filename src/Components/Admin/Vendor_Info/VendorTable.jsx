import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import Navbar from "../Navbar";

import { db } from "../../../config/firebase";

import { collection } from "firebase/firestore";

import { getDocs } from "firebase/firestore";

const VendorList = () => {
  const [vendorDetails, setVendorDetails] = useState([]);

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const pickupCollectionRef = collection(db, "vendor");
        const querySnapshot = await getDocs(pickupCollectionRef);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setVendorDetails(data);
      } catch (error) {
        console.error("Error fetching pickup data:", error);
      }
    };

    fetchVendorDetails();
  }, []);

  return (
    <>
      <Navbar nav1={"item"} nav2={"home"} />
      <Typography
        align="center"
        variant="h3"
        sx={{
          margin: "30px",
          fontSize: { md: "28px", xs: "18px" },
          fontWeight: "bold",
        }}
      >
        Vendor Details
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          maxWidth: "80%",
          margin: "0 auto",
        }}
      >
        <Table sx={{ minWidth: "400px" }}>
          <TableHead>
            <TableRow>
              <TableCell>VendorId</TableCell>
              <TableCell>Vendor Name</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vendorDetails.map((vendor) => (
              <TableRow
                key={vendor.id}
                component={Link}
                to={`/admin/vendor_info/${vendor.id}`}
                style={{ textDecoration: "none" }}
              >
                <TableCell>{vendor.id}</TableCell>
                <TableCell>{vendor.name}</TableCell>
                <TableCell>{vendor.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default VendorList;
