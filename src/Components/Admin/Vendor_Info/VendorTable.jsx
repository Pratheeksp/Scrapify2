import React from "react";
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
export const vendors = [
  {
    id: 1,
    name: "Vendor 1",
    contactNumber: "1234567890",
    email: "vendor1@example.com",
    address: "123 Street, City",
    locality: "Locality 1",
    currentPickup: { pickupId: 1, amount: 100, customerName: "Customer A" },
    pickupHistory: [
      { pickupId: 1, amount: 100, customerName: "Customer A" },
      { pickupId: 2, amount: 150, customerName: "Customer B" },
    ],
  },
  {
    id: 2,
    name: "Vendor 2",
    contactNumber: "0987654321",
    email: "vendor2@example.com",
    address: "456 Street, City",
    locality: "Locality 2",
    currentPickup: { pickupId: 3, amount: 200, customerName: "Customer C" },
    pickupHistory: [
      { pickupId: 3, amount: 200, customerName: "Customer C" },
      { pickupId: 4, amount: 180, customerName: "Customer D" },
    ],
  },
];

const VendorList = () => {
  return (
    <>
      <Navbar  nav1={"dashboard"} nav2={"home"}/>
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
              <TableCell>Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vendors.map((vendor) => (
              <TableRow
                key={vendor.id}
                component={Link}
                to={`/admin/vendor_info/${vendor.id}`}
                style={{ textDecoration: "none" }}
              >
                <TableCell>{vendor.id}</TableCell>
                <TableCell>{vendor.name}</TableCell>
                <TableCell>{vendor.address}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default VendorList;
