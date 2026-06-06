import React from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Recommend from '../components/Recommend'
import Attractions from '../components/Attractions'
import PopularDestinations from '../components/PopularDestinations'
import FeaturedAttractions from '../components/FeaturedAttractions'
import Footer from '../components/Footer'
import HowItWorks from '../components/HowItWorks'
const LandingPage = () => {
  return (
    <div>
      <Header/>
      <Hero/>
      <Recommend/>
      <Attractions/>
      <PopularDestinations/>
      <FeaturedAttractions/>
      <HowItWorks/>
      <Footer/>
    </div>
  )
}

export default LandingPage
