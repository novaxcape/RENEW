import React from 'react'
import PaymentCheckout from '../components/PaymentCheckout'
import Footer from '../components/Footer'
import PaymentHeader from '../components/PaymentHeader'
const PaymentOptionPage = () => {
  return (
    <div>
      <PaymentHeader/>
      <PaymentCheckout/>
      <Footer/>
    </div>
  )
}

export default PaymentOptionPage
