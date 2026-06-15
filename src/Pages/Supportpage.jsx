import React from "react";
import Supportpageherocontent from "../components/Supportpageherocontent";
import Supportpagesubherocontext from "../components/Supportpagesubherocontext";
import { FaQ } from "react-icons/fa6";
import FAQ from "../components/Faq";
import Call from "../components/Call";
import Footer from "../components/Footer";

const Supportpage = () => {
  return (
    <main className="supportpage_wrapper">
      <section className="supportpage_container">
        <Supportpageherocontent />
        <Supportpagesubherocontext />

        <FAQ />
        <Call />
        <Footer />
      </section>
    </main>
  );
};

export default Supportpage;


