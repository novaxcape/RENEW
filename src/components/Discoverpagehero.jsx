import React from "react";
import "../components/css/Discoverpagehero.css";
import { IoLocationOutline } from "react-icons/io5";
import { IoSearchOutline } from "react-icons/io5";
import { CiFilter } from "react-icons/ci";
import { IoChevronDown } from "react-icons/io5";

const Discoverpagehero = ({ searchState, setSearchState, onSearch }) => {
  return (
    <section className="hero">
      <div className="hero_overlay"></div>

      <div className="hero_content">
        <h1>Discover Attractions</h1>

        <p>Discover amazing tourism centres across Nigeria</p>

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
              placeholder="Search centres by state"
              value={searchState}
              onChange={(e) => setSearchState(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
            />
          </div>

          <button className="filter_btn" type="button" onClick={onSearch}>
            <CiFilter />
            Search
          </button>
        </div>
      </div>
    </section>
  );
};

export default Discoverpagehero;
