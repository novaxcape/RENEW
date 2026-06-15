// src/components/RootLayout.jsx
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
// import Discoverpage from "../Pages/Discoverpage"
// import Centres from "../Pages/Centres"
import PaymentHeader from "../components/PaymentHeader";

const RootLayout = () => {
  // Check if a token exists in localStorage to determine login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Replace "userToken" with whatever key your app uses to store login tokens/data
    const token = localStorage.getItem("userToken");
    setIsLoggedIn(!!token); 
  }, []);

  return (
    <>
      {/* Dynamic Header Switch */}
      {isLoggedIn ? <Header /> : <PaymentHeader />}

      {/* Main Page Content injection window */}
      <main className={isLoggedIn ? "payment-page-offset" : "has-fixed-header"}>
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;