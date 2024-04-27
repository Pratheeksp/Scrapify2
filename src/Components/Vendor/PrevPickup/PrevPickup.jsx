import { Box, Divider, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../config/firebase";
function PrevPickup() {
  const pickups = [
    {
      orderId: 1,
      date: "2022-01-15",
      totalPrice: 150,
      scrapsSold: [
        { item: "Paper", quantity: 10 },
        { item: "Metal", quantity: 5 },
      ],
    },
    {
      orderId: 2,
      date: "2022-02-01",
      totalPrice: 200,
      scrapsSold: [
        { item: "Plastic", quantity: 15 },
        { item: "Glass", quantity: 10 },
      ],
    },
    {
      orderId: 3,
      date: "2022-03-10",
      totalPrice: 180,
      scrapsSold: [
        { item: "Cardboard", quantity: 8 },
        { item: "Aluminum", quantity: 10 },
      ],
    },
  ];
  const [pickupData, setPickupData] = useState([]);

  useEffect(() => {
    const vendorId = localStorage.getItem("vid");

    const fetchPickups = async () => {
      try {
        const paymentDocRef = collection(db, "payment");
        const querySnapshot = await getDocs(
          query(paymentDocRef, where("vendorId", "==", vendorId))
        );

        const pickupsData = [];
        querySnapshot.forEach((doc) => {
          pickupsData.push(doc.data());
        });

        setPickupData(pickupsData);
      } catch (err) {
        console.error("Error fetching pickups:", err);
      }
    };

    fetchPickups();
  }, []);

  return (
    <>
      <Navbar nav1={"Home"} nav2={"My Profile"} />
      <Box>
        {pickupData.length !== 0 ? (
          <>
            <Box
              sx={{
                margin: "5vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography fontWeight={"bolder"}>
                Your Previous pickup's
              </Typography>
              {pickupData.map((pick) => (
                <Box
                  sx={{
                    width: "70vw",
                    minheight: { xs: "140px", sm: "160px" },
                    border: "0.8px solid grey",
                    borderRadius: "5px",
                    mt: "4vh",
                    padding: "2vh 5vw",
                    backgroundColor: "rgba(200, 200, 200, 0.07)",
                  }}
                >
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    mb={"1vh"}
                  >
                    <Typography color={"grey"}>
                      {pick.date?.toDate().toLocaleDateString()}
                    </Typography>
                    <Typography color={"grey"}>Id: {pick.pickupId}</Typography>
                  </Box>

                  <Typography fontWeight={"bolder"} fontSize={"20px"}>
                    Amount: &#8377;&nbsp;{pick.amount}
                  </Typography>
                  <Divider sx={{ margin: "2vh 0" }} />

                  <ul
                    style={{
                      listStyle: "none",
                      display: "flex",
                      flexWrap: "wrap",
                    }}
                  >
                    {pick.material_info.map((scrap) => (
                      <li
                        style={{
                          padding: "0 1vw",
                          borderRight: "1px solid rgb(11, 225, 44)",
                        }}
                      >
                        {scrap.subcat}
                      </li>
                    ))}
                  </ul>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "end",
                      marginTop: "2vh",
                    }}
                  ></Box>
                </Box>
              ))}
            </Box>
          </>
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                marginTop: "25vh",
              }}
            >
              <Typography width={"60vw"}>No Previous Pickups</Typography>
              {/* <Button
                sx={{
                  textTransform: "none",
                  color: "white",
                  fontWeight: "bolder",
                  backgroundColor: "rgb(11, 225, 44)",
                  padding: "10px",
                  margin: "5vh 0",
                }}
              >
                Raise pickup request
              </Button> */}
            </Box>
          </>
        )}
      </Box>
    </>
  );
}

export default PrevPickup;
