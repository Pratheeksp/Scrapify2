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
import {
  collection,
  doc,
  getDoc,
  getDocs,
  where,
  orderBy,
} from "firebase/firestore";
import { query } from "firebase/database";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";

const VendorInfo = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState({});
  const [prevPickup, setPrevPickup] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

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
          query(
            paymentDocRef,
            where("vendorId", "==", id),
            orderBy("date", "desc")
          )
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

  //Calculating avg rating
  useEffect(() => {
    // pickups whose rating isnt give from cust page is filtered out
    const validPickups = prevPickup.filter(
      (pickup) => typeof pickup.rating === "number"
    );

    if (validPickups.length > 0) {
      const totalRating = validPickups.reduce((acc, pickup) => {
        return acc + pickup.rating;
      }, 0);
      const avgRating = totalRating / validPickups.length;
      setAverageRating(avgRating);
    } else {
      // If there are no valid previous pickups with ratings thne set average rating to 0
      setAverageRating(0);
    }
  }, [prevPickup]);

  const displayRating = (rating) => {
    const ratingCriteria = {
      0: "vlow",
      1.5: "low",
      3.0: "mid",
      4.0: "high",
      4.5: "vhigh",
    };

    const faceCriteria = {
      vlow: <SentimentVeryDissatisfiedIcon style={{ color: "red" }} />,
      low: <SentimentDissatisfiedIcon style={{ color: "red" }} />,
      mid: <SentimentNeutralIcon style={{ color: "#FDDE55" }} />,
      high: <SentimentSatisfiedIcon style={{ color: "lightgreen" }} />,
      vhigh: <SentimentSatisfiedAltIcon style={{ color: "green" }} />,
    };

    let ratingLabel;
    if (rating >= 0 && rating < 1.5) {
      ratingLabel = ratingCriteria[0];
    } else if (rating >= 1.5 && rating < 3.0) {
      ratingLabel = ratingCriteria[1.5];
    } else if (rating >= 3.0 && rating < 4.0) {
      ratingLabel = ratingCriteria[3.0];
    } else if (rating >= 4.0 && rating < 4.5) {
      ratingLabel = ratingCriteria[4.0];
    } else if (rating >= 4.5 && rating <= 5.0) {
      ratingLabel = ratingCriteria[4.5];
    }

    return faceCriteria[ratingLabel];
  };

  return (
    <>
      <Navbar nav1={"item"} nav2={"home"} />
      <Box
        sx={{ backgroundColor: "rgba(211, 211, 211, 0.3)", height: "100vh",padding:"20px" }}
      >
        <Box
          sx={{

            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor:"white"
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
              </Typography>{" "}
              <Typography
                sx={{ lineHeight: 2, fontSize: { md: "18px ", xs: "13px" } }}
              >
                Vendor Id: {id}
              </Typography>
              <Typography
                sx={{ lineHeight: 2, fontSize: { md: "18px ", xs: "13px" } }}
              >
                Avg Rating: {averageRating.toFixed(2)}
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
              sx={{ margin: "20px", width: { md: "90%", xs: "90%" } }}
            >
              <Table sx={{ fontSize: { md: "14px", xs: "10px" } }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Payment ID</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Payment Mode</TableCell>
                    <TableCell>Rating</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody sx={{ width: { md: "90%", xs: "90%" } }}>
                  {prevPickup.map((pickup) => (
                    <TableRow key={pickup.id}>
                      <TableCell sx={{ textWrap: "nowrap" }}>
                        {new Date(pickup.date.toDate()).toLocaleString(
                          "en-US",
                          {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )}
                      </TableCell>
                      <TableCell>{pickup.pickupId}</TableCell>
                      <TableCell>{pickup.id}</TableCell>
                      <TableCell>{pickup.amount}</TableCell>
                      <TableCell>{pickup.mode}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {displayRating(pickup.rating)}
                          <Typography
                            sx={{ marginLeft: "5px", fontSize: "small" }}
                          >
                            {pickup.rating}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>
    </>
  );
};

export default VendorInfo;
