import React from "react";
import Header from "../components/Header";
import Aboutpagehero from "../components/Aboutpagehero";
import Aboutsection from "../components/Aboutsection";
import Ourgoal from "../components/Ourgoal";
import Whychooseus from "../components/Whychooseus";
import Footer from "../components/Footer";

const Aboutpage = () => {
  return (
    <section>
      <Header />
      <Aboutpagehero />
      <Aboutsection />
      <Ourgoal />
      <Whychooseus />
      <Footer />
    </section>
  );
};

export default Aboutpage;
