import React from "react";
import Aboutpagehero from "../components/Aboutpagehero";
import Aboutsection from "../components/Aboutsection";
import Ourgoal from "../components/Ourgoal";
import Whychooseus from "../components/Whychooseus";
import Footer from "../components/Footer";

const Aboutpage = () => {
  return (
    <section>
      <Aboutpagehero />
      <Aboutsection />
      <Ourgoal />
      <Whychooseus />
      <Footer />
    </section>
  );
};

export default Aboutpage;
