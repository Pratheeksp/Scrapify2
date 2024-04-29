import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Navbar from "../Navbar";
import { Typography } from "@mui/material";
import { db } from "../../../config/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import TablePagination from "@mui/material/TablePagination";
import TableSortLabel from "@mui/material/TableSortLabel";
import axios from "axios";

const StyledTableContainer = styled(TableContainer)`
  max-width: 100%;
  margin: 0 auto;
`;

const StyledTable = styled(Table)`
  min-width: 650px;
`;

const BalanceWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const BalanceText = styled(Typography)`
  font-size: 24px;
  font-weight: bold;
`;

const Dashboard = () => {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  // const [balance, setBalance] = useState(null);
  const paymentDetails = [];

  const fetchData = async () => {
    try {
      // setLoading(true); // Display loader while fetching data
  
      const paymentCollectionRef = collection(db, "payment");
      const unsubscribe = onSnapshot(paymentCollectionRef, (snapshot) => {
        const newPaymentDetails = []; // Create a new array to store the payment details
  
        snapshot.forEach((doc) => {
          const paymentData = doc.data();
          const id = doc.id;
  
          // Format createdAt timestamp
          const createdAt = new Date(paymentData.date.toDate()).toLocaleString(
            "en-US",
            {
              month: "short",
              day: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }
          );
  
          newPaymentDetails.push({
            id,
            ...paymentData,
            createdAt,
          });
        });
  
        // Sort the details by orderBy and order
        const sortedDetails = stableSort(
          newPaymentDetails,
          getComparator(order, orderBy)
        );
  
        setTotalRows(sortedDetails.length);
        const paginatedDetails = sortedDetails.slice(
          page * rowsPerPage,
          (page + 1) * rowsPerPage
        );
        setDetails(paginatedDetails);
        // setLoading(false); // Hide loader after data is fetched
      });
  
      return () => {
        // Unsubscribe from the real-time listener when component unmounts
        unsubscribe();
      };
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };
  

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, orderBy, order]); // Fetch data when page, rowsPerPage, orderBy, or order changes

  //  fetch balance
  // useEffect( () => {
  //   const fetchBal = async () => {
  //     try {
  //       const balanceResponse = await axios.get("http://localhost:8080/getBalance");
  //       setBalance(balanceResponse.data.items[0].balance / 100);
  //     } catch (error) {
  //       console.error("Error fetching balance:", error.message);
  //     }
  //   };
  //   fetchBal();
  // },[paymentDetails])
  

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  return (
    <>
      {/* <Navbar nav1={"Home"} nav2={"vendors"} /> */}
      <Typography

        variant="h3"
        sx={{
          margin: "30px 0px",
          fontSize: { md: "28px", xs: "18px" },
          fontWeight: "bold",
        }}
      >
        Previous Payments
      </Typography>
      {loading ? (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      ) : (
        <>
          <StyledTableContainer
            component={Paper}
            sx={{
              width: { md: "100%", xs: "100%" },
            }}
          >
            <StyledTable aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ minWidth: "150px" }}>
                    <TableSortLabel
                      active={orderBy === "createdAt"}
                      direction={orderBy === "createdAt" ? order : "asc"}
                      onClick={() => handleRequestSort("createdAt")}
                    >
                      Created at
                    </TableSortLabel>
                  </TableCell>
                  <TableCell style={{ minWidth: "150px", height: "50px" }}>
                    Payment ID
                  </TableCell>
                  <TableCell style={{ minWidth: "150px", height: "50px" }}>
                    <TableSortLabel
                      active={orderBy === "amount"}
                      direction={orderBy === "amount" ? order : "asc"}
                      onClick={() => handleRequestSort("amount")}
                    >
                      Amount
                    </TableSortLabel>
                  </TableCell>
                  <TableCell style={{ minWidth: "150px", height: "50px" }}>
                    Status
                  </TableCell>
                  <TableCell style={{ minWidth: "150px", height: "50px" }}>
                    <TableSortLabel
                      active={orderBy === "mode"}
                      direction={orderBy === "mode" ? order : "asc"}
                      onClick={() => handleRequestSort("mode")}
                    >
                      Mode
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {details.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.createdAt}</TableCell>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.amount}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{item.mode}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </StyledTable>
          </StyledTableContainer>

          <TablePagination
            sx={{ marginRight: { md: "200px", sm: "20px" } }}
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalRows}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
          />
          {/* <BalanceWrapper>
            <BalanceText>Balance: {balance}</BalanceText>
          </BalanceWrapper> */}
        </>
      )}
    </>
  );
};

export default Dashboard;

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
