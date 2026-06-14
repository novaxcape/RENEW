import React from "react";
import Discoverpagehero from "../components/Discoverpagehero";
import Discoversection from "../components/Discoversection";
import Footer from "../components/Footer";
import { getTouristCentersByState } from "../redox/apiSlice";

const Discoverpage = () => {
    return (
   <div>
        <Discoverpagehero />
        <Discoversection />
        <Footer />
   </div>
    );
};

export default Discoverpage;
