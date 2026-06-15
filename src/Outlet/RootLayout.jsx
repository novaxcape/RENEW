// components/RootLayout.jsx
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import PaymentHeader from "../components/PaymentHeader";

const RootLayout = () => {
  // 1. Setup authentication state (Default to false/logged out)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 2. Optional: Check if a user token exists on mount (e.g., from localStorage)
  useEffect(() => {
    const userToken = localStorage.getItem("userToken"); // or whatever key your app uses
    if (userToken) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <>
      {/* 3. Conditionally render the correct header based on auth status */}
      {isLoggedIn ? <PaymentHeader /> : <Header />}

      {/* 4. This is where your page views are injected dynamically */}
      <main className={isLoggedIn ? "payment-page-offset" : "has-fixed-header"}>
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;