import React from "react";
import { Outlet } from "react-router-dom";
import PaymentHeader from "../component/PaymentHeader.jsx"

const MainLayout = () => {
  return (
    <>
      <PaymentHeader />
      <div className="has-fixed-header">
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;