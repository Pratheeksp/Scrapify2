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
import TablePagination from "@mui/material/TablePagination";

const StyledTableContainer = styled(TableContainer)`
  max-width: 100%;
  margin: 0 auto;
`;

const StyledTable = styled(Table)`
  min-width: 650px;
`;

const Dashboard = () => {
  const [details, setDetails] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const fetchData = async () => {
    try {
      const skip = page * rowsPerPage;
      const count = rowsPerPage;
      const url = `http://localhost:8080/getdetails?count=${count}&skip=${skip}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      // console.log(data.items);
      setDetails(
        data.items.map((item) => ({
          ...item,
          formattedDateTime: new Date(item.created_at * 1000).toLocaleString(
            "en-US",
            {
              hour: "numeric",
              minute: "numeric",
              month: "short",
              day: "numeric",
              hour12: true,
            }
          ),
        }))
      );
      setTotalRows(data.totalCount); // Update totalRows
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage]);

  return (
    <>
      <Navbar nav1={"Home"} nav2={"vendors"} />
      <Typography
        align="center"
        variant="h3"
        sx={{
          margin: "30px",
          fontSize: { md: "28px", xs: "18px" },
          fontWeight: "bold",
        }}
      >
        Payment Dashboard
      </Typography>
      {details === undefined || details.length === 0 ? (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      ) : (
        <>
          <StyledTableContainer
            component={Paper}
            sx={{
              width: { md: "80%", xs: "100%" },
            }}
          >
            <StyledTable aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ minWidth: "150px" }}>
                    Created at
                  </TableCell>
                  <TableCell style={{ minWidth: "150px" }}>Payment ID</TableCell>
                  <TableCell style={{ minWidth: "150px" }}>Amount</TableCell>
                  <TableCell style={{ minWidth: "150px" }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {details.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.formattedDateTime}</TableCell>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.amount / 100}</TableCell>
                    <TableCell>{item.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </StyledTable>
          </StyledTableContainer>
          <TablePagination
            sx={{ marginRight: { md: "200px", sm: "20px" } }}
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={30}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
          />
        </>
      )}
    </>
  );
};

export default Dashboard;
