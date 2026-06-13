import React from "react";
import PaymentHeader from "../components/PaymentHeader"
import Aboutpagehero from "../components/Aboutpagehero";
import Aboutsection from "../components/Aboutsection";
import Ourgoal from "../components/Ourgoal";
import Whychooseus from "../components/Whychooseus";
import Footer from "../components/Footer";

const Aboutpage = () => {
  return (
    <section>
      <PaymentHeader />
      <Aboutpagehero />
      <Aboutsection />
      <Ourgoal />
      <Whychooseus />
      <Footer />
    </section>
  );
};

export default Aboutpage;
