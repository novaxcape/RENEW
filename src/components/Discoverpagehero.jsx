import React from "react";
import "../components/css/Discoverpagehero.css";
import { IoLocationOutline } from "react-icons/io5";
import { IoSearchOutline } from "react-icons/io5";
import { IoFilterOutline } from "react-icons/io5";
import { IoChevronDown } from "react-icons/io5";

const Discoverpagehero = () => {
  return (
    <section className="hero">
      <div className="hero_overlay"></div>

      <div className="hero_content">
        <h1>Discover Attractions</h1>

        <p>
          Discover amazing tourism centres across Nigeria
        </p>

        <div className="destination_btn">
          <IoLocationOutline />
          <span>Choose Destination</span>
          <IoChevronDown />
        </div>

        <div className="search_container">
          <div className="search_input">
            <IoSearchOutline />
            <input
              type="text"
              placeholder="Type here"
            />
          </div>

          <button className="filter_btn">
            <IoFilterOutline />
            Filter By
          </button>
        </div>
      </div>
    </section>
  );
};

export default Discoverpagehero;