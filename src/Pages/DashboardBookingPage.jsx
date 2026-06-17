import React from 'react'
import { useOutletContext } from 'react-router-dom'
import TopNavbar2 from '../components/TopNavbar2'
import BookingManagement from '../components/BookingManagement'
import PerformanceInsight from '../components/PerformanceInsight'
import "../Styles/Dashboard.css"
const DashboardBookingPage = () => {
  const { openMobileMenu = () => {} } = useOutletContext() || {}

  return (
    <>
      <div className="sticky-wrapper">
        <TopNavbar2 onMenuOpen={openMobileMenu} />
      </div>

      <BookingManagement/>
      <div className="bottom-section">
        <PerformanceInsight />
        
      </div>
    </>
  )
}

export default DashboardBookingPage
