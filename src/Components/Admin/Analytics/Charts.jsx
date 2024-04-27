import { Box, Grid } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../../config/firebase";
import { PieChart } from "@mui/x-charts/PieChart";
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
      setChartData(updatedCategoriesData)
      console.log("final data", updatedCategoriesData);
    };
    fetchchartdata();
  }, []);

  //fetch payment
  return (
    <>
      <Grid container spacing={2} sx={{ marginTop: "3vh" }}>
        <Grid item xs={12} sm={6}>
          {
            (chartData.length!==0) && (<Chart1 chartData={chartData}/>)
          }
        </Grid>
        <Grid item xs={12} sm={6}>
        {
            (chartData.length!==0) && (<Chart2 chartData={chartData}/>)
          }
        </Grid>
      </Grid>
    </>
  );
};

function Chart1({chartData}) {

  console.log("Chart data received",chartData)
  const categoryData = chartData.map((category) => {
    const totalCategoryPrice = category.subcategories.reduce(
      (total, subcategory) => total + subcategory.totalPrice,
      0
    );
    return [category.cat, totalCategoryPrice];
  });

  const piechartdata=[["Category", "Total Price"], ...categoryData];
  const options = {
    // title: "Total earnings",
    // legend:'none'
    legend: {position: 'bottom', textStyle: {color: 'blue', fontSize: 16},alignment:'start'}
    // pieHole:10

  };
  return (
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: "10px",
        width: "100%",
        height: "55vh", 
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

function Chart2({chartData}) {
  const linechartdata = chartData.map((category) => {
    const data = category.subcategories.map((subcategory) => {
      return [subcategory.subcat, subcategory.totalPrice];
    });
    return [{ type: "string", label: "Subcategory" }, ...data];
  });

  const options = {
    title: "Total Price of Subcategories for Each Category",
    legend: { position: "top", maxLines: chartData.length },
    chartArea: { width: "50%" },
    hAxis: { title: "Subcategory" },
    vAxis: { title: "Total Price" },
    series: {},
  };

  const seriesVisibility = chartData.reduce((obj, category, index) => {
    obj[index] = { visibleInLegend: true };
    return obj;
  }, {});

  options.series = seriesVisibility;

  return (
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: "10px",
        width: "100%", 
        height: "55vh", 
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
       <Chart
      chartType="LineChart"
      data={linechartdata}
      options={options}
      width={"100%"}
      height={"300px"}
    />

    </Box>
  );
}

export default Charts;
