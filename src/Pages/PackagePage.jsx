import React from 'react'
import { useOutletContext } from 'react-router-dom'
import TopNavbar2 from '../components/TopNavbar2'
import PackageSettings from '../components/PackageSettings'
const PackagePage = () => {
  const { openMobileMenu = () => {} } = useOutletContext() || {}

  return (
   <>
      <div className="sticky-wrapper">
        <TopNavbar2 onMenuOpen={openMobileMenu} />
      </div>

      <PackageSettings/>
      
    </>
  )
}

export default PackagePage
