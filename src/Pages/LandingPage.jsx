import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Recommend from "../components/Recommend";
import PopularDestinations from "../components/PopularDestinations";
import FeaturedAttractions from "../components/FeaturedAttractions";
import HowItWorks from "../components/HowItWorks";
// import "./css/Home.css";
import "../Styles/Home.css"
import TopAttractions from "../components/TopAttractions";
import Trusted from "../components/Trusted";
import CtaSection from "../components/CtaSection";
import Footer from "../components/Footer";
const LandingPage = () => {
  return (
    <div className="home-container">
      <Header />
      <div className="home-content">
        <Hero />
        <Recommend />
        <TopAttractions/>
        <PopularDestinations />
        <FeaturedAttractions />
        <HowItWorks />
        <Trusted/>
        <CtaSection/>
         <Footer/>
      </div>
    </div>
  );
};

export default LandingPage;