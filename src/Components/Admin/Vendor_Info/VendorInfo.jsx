import React from "react";
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
import { vendors } from "./VendorTable";
import { Avatar } from "@mui/material";
import Navbar from "../Navbar";
import man from "./man.png";

const VendorInfo = () => {
  // Access URL parameters
  const { id } = useParams();

  // Find the vendor object with the matching id
  const vendor = vendors.find((vendor) => vendor.id === parseInt(id));

  return (
    <>
      <Navbar nav1={"dashboard"} nav2={"home"} />
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
              Contact: {vendor.contactNumber}
            </Typography>
            <Typography
              sx={{ lineHeight: 2, fontSize: { md: "18px", xs: "13px" } }}
            >
              Address: {vendor.address}
            </Typography>
          </Box>
          <Box sx={{ flexGrow: "3", display: "flex" }}>
            <Avatar
              alt="Remy Sharp"
              src={man}
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
        <Box>
          <TableContainer
            component={Paper}
            sx={{ margin: "20px", width: { md: "50%", xs: "90%" } }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Pickup ID</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Customer Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vendor.pickupHistory.map((pickup) => (
                  <TableRow key={pickup.pickupId}>
                    <TableCell>{pickup.pickupId}</TableCell>
                    <TableCell>{pickup.amount}</TableCell>
                    <TableCell>{pickup.customerName}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
};

export default VendorInfo;
