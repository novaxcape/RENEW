import React from 'react'
import { Outlet } from "react-router-dom";
import Header from "../component/Header.jsx"


const SemiLayout = () => {
  return (
    <>
      <Header />
      <div className="has-fixed-header">
        <Outlet />
      </div>
    </>>
  )
}

export default SemiLayout
