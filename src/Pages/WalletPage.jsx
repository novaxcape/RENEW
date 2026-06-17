import React from 'react'
import { useOutletContext } from 'react-router-dom';
import TopNavbar from "../components/TopNavbar";
import Wallet from '../components/Wallet';
import PerformanceInsight from "../components/PerformanceInsight";
import CapacityGoals from "../components/CapacityGoals";
import "../Styles/Dashboard.css";
const WalletPage = () => {
  const { openMobileMenu = () => {} } = useOutletContext() || {};

  return (
     <>
      <div className="sticky-wrapper">
        <TopNavbar onMenuOpen={openMobileMenu} />
      </div>
       <Wallet/>

       <div className="bottom-section">
        <PerformanceInsight />
        <CapacityGoals />
      </div>
    </>
  )
}

export default WalletPage
