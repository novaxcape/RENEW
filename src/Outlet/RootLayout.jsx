// src/components/RootLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

const RootLayout = () => {
  const { isAuthenticated: isLoggedIn } = useAuth();

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