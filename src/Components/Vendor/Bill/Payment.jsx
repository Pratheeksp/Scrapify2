import React from "react";
import { Button } from "@mui/material";
import { useLocation } from "react-router-dom";

import axios from "axios";

function Payment() {
  const location = useLocation();

  const { billItems } = location.state;
  //   console.log(billItems)
  const totalPrice = billItems.reduce((total, item) => total + item.tprice, 0);

  // const sendEmail = async () => {
  //   try {
  //     const response = await axios.post("http://localhost:8080/send-email", {
  //       from: "onboarding@resend.dev",
  //       to: "rohanacharv@gmail.com",
  //       subject: "Scrapify Invoice",
  //       html: billHtml,
  //     });
  //     console.log(response.data);
  //   } catch (error) {
  //     console.error("Error sending email:", error);
  //   }
  // };
  // -------------------- PAYMENT ------------------------------  //
  const amount = totalPrice;
// I am sending the customer details from here So when U are fetching update the correct details below 
  const paymentHandle = async (e) => {
    
    const response = await axios.post("http://localhost:8080/payment", {
      //update the actual details that are fetched (to=email),upiid,name,oredrid
      amount: amount,
      from: "onboarding@resend.dev",
      to: "skanda.udupi02@gmail.com",
      subject: "Scrapify Invoice",
      customerupi:"7829926870@paytm",
      customername:"RohanAchar",
      contact:'7829926870',
      billItems,
      pickupid:'98098hvgf_6@78y'
    });

    console.log(response.data);

  };

  return (
    <>
      <h1>This is payment gateway</h1>
      <h2>
        Once the payment the bill should automatically be sent through email.
        Now I have made it a manual buttton
      </h2>
      
      <Button onClick={paymentHandle}>Pay</Button>
    </>
  );
}

export default Payment;
