import React from 'react'
import { useOutletContext } from 'react-router-dom'
import TopNavbar2 from '../components/TopNavbar2'
import "../Styles/Dashboard.css"
import Passcode from '../components/Passcode'
const VerifyPage = () => {
     const { openMobileMenu = () => {} } = useOutletContext() || {}
  return (
    <>
      <div className="sticky-wrapper">
        <TopNavbar2 onMenuOpen={openMobileMenu} />
      </div>

      <Passcode/>
    </>
  )
}

export default VerifyPage
