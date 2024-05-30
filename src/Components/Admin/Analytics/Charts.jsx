import { Box, Grid, Typography } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../../config/firebase";

import { Chart } from "react-google-charts";
// import { Pie } from 'react-chartjs-2';

// fetch all categ and subcat
//subacat - add field total price =0

//chartdata={cat, subcat:{name, price, unit,tprice=0,tqty=0}....]}
const Charts = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchchartdata = async () => {
      const categoryDocRef = collection(db, "categories");
      const categorySnapshot = await getDocs(categoryDocRef);
      const categoriesData = categorySnapshot.docs.map((doc) => doc.data());

      const paymentDocRef = collection(db, "payment");
      const paymentSnapshot = await getDocs(paymentDocRef);
      const paymentsData = paymentSnapshot.docs.map((doc) => doc.data());

      const updatedCategoriesData = categoriesData.map((category) => {
        const updatedSubcategories = category.subcategories.map(
          (subcategory) => {
            const { subcat } = subcategory;
            const subcatTotals = paymentsData.reduce(
              (acc, payment) => {
                payment.material_info.forEach((material) => {
                  if (material.subcat === subcat) {
                    acc.totalPrice += material.tprice;
                    acc.totalQuantity += material.quantity;
                  }
                });
                return acc;
              },
              { totalPrice: 0, totalQuantity: 0 }
            );

            return {
              ...subcategory,
              totalPrice: subcatTotals.totalPrice,
              totalQuantity: subcatTotals.totalQuantity,
            };
          }
        );

        return {
          ...category,
          subcategories: updatedSubcategories,
        };
      });
      setChartData(updatedCategoriesData);
      console.log("final data", updatedCategoriesData);
    };
    fetchchartdata();
  }, []);

  //fetch payment
  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{ marginBottom: "5vh", marginTop: "3vh" }}
      >
        <Grid item xs={12} sm={6}>
          {chartData.length !== 0 && <Chart1 chartData={chartData} />}
        </Grid>
        <Grid item xs={12} sm={6}>
          {chartData.length !== 0 && <Chart2 chartData={chartData} />}
        </Grid>
      </Grid>
    </>
  );
};

function Chart1({ chartData }) {
  console.log("Chart data received", chartData);
  const categoryData = chartData.map((category) => {
    const totalCategoryPrice = category.subcategories.reduce(
      (total, subcategory) => total + subcategory.totalPrice,
      0
    );
    return [category.cat, totalCategoryPrice];
  });

  const piechartdata = [["Category", "Total Price"], ...categoryData];
  const options = {
    // title: "Total earnings",
    // legend:'none'
    legend: {
      position: "bottom",
      textStyle: { color: "blue", fontSize: 16 },
      alignment: "start",
    },
    // pieHole:10
  };
  return (
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: "10px",
        width: "100%",
        height: "65vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Chart
        chartType="PieChart"
        data={piechartdata}
        options={options}
        width={"100%"}
        height={"100%"}
      />
    </Box>
  );
}

function Chart2({ chartData }) {
  const [visibleCategoryIndex, setVisibleCategoryIndex] = useState(0);

  const handleLegendClick = (index) => {
    setVisibleCategoryIndex(index);
  };

  // Prepare data for the selected category
  const selectedCategory = chartData[visibleCategoryIndex];
  const data = [
    ["Subcategory", "Total Price"],
    ...selectedCategory.subcategories.map((subcategory) => [
      subcategory.subcat,
      subcategory.totalPrice,
    ]),
  ];

  const totalCategoryPrice = selectedCategory.subcategories.reduce(
    (total, subcategory) => total + subcategory.totalPrice,
    0
  );
  // Prepare options for the chart
  const options = {
    // title: `${selectedCategory.cat} , Total earned : ${totalCategoryPrice} , Total profit : ${totalCategoryPrice * selectedCategory.profit *0.01}`,
    legend: "none",
    chartArea: { width: "70%" },
    axisTitlesPosition: "in",
    // hAxis: { title: "Subcategories" },
    // vAxis: { title: "Total Price" },
  };
  return (
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: "10px",
        width: "100%",
        height: "65vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Typography sx={{ fontWeight: "bold", color: "blue" }}>
        {selectedCategory.cat}
      </Typography>
      <Typography>
        {/* <span style={{ fontWeight: "bold" ,color:'blue'}}>{selectedCategory.cat}</span> */}
        <span style={{ color: "grey" }}> Total earned: </span>
        <span style={{ fontWeight: "bold", color: "black" }}>
          &#x20B9;&nbsp;{totalCategoryPrice}
        </span>
        <span style={{ color: "grey" }}> , Total profit: </span>
        <span style={{ fontWeight: "bold", color: "black" }}>
          &#x20B9;&nbsp;{(totalCategoryPrice * selectedCategory.profit * 0.01).toFixed(2)}
        </span>
      </Typography>

      <Chart
        chartType="LineChart"
        data={data}
        options={options}
        width={"100%"}
        height={"90%"}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "5px",
        }}
      >
        {chartData.map((category, index) => (
          <div
            key={index}
            onClick={() => handleLegendClick(index)}
            style={{
              cursor: "pointer",
              margin: "0 5px",
              color: visibleCategoryIndex === index ? "blue" : "black",
            }}
          >
            {category.cat}
          </div>
        ))}
      </div>
    </Box>
  );
}

export default Charts;
