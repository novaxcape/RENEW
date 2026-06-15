import React from 'react'
import TopNavbar2 from '../components/TopNavbar2'
import BookingManagement from '../components/BookingManagement'
import PerformanceInsight from '../components/PerformanceInsight'
import "../Styles/Dashboard.css"
const DashboardBookingPage = () => {
  return (
    <div className="dashboard-content">
      <div className="sticky-wrapper">
        <TopNavbar2/>
      </div>

      <BookingManagement/>
      <PerformanceInsight/>
    </div>
  )
}

export default DashboardBookingPage
