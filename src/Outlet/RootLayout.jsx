// src/components/RootLayout.jsx
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import PaymentHeader from "../components/PaymentHeader";

const RootLayout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // ✅ FIX: Double exclamation marks convert a real token to 'true' 
    // and a null token to 'false'
    setIsLoggedIn(!!token); 
  }, []);

  return (
    <>
      <Header />

      {/* Main Page Content injection window */}
      <main className={isLoggedIn ? "payment-page-offset" : "has-fixed-header"}>
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;