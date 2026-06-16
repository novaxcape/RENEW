import React, { useState, useEffect } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { IoSearchOutline } from "react-icons/io5";
import { CiFilter } from "react-icons/ci";
import { IoChevronDown } from "react-icons/io5";
import "../components/css/Discoverpagehero.css";

const LOCATIONS = [
  "Lagos",
  "Abuja",
  "Port Harcourt",
  "Calabar",
  "Kastina",
  "Enugu",
  "Ibadan",
  "Ogun",
  "Kano",
  "Rivers",
  "Delta",
  "Edo",
];

const Discoverpagehero = ({ 
  searchState, 
  setSearchState, 
  selectedLocation, 
  setSelectedLocation, 
  onSearch,
  loading 
}) => {
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setSearchState(location);
    setLocationDropdownOpen(false);
    if (onSearch) onSearch(location);
  };

  const handleSearch = () => {
    if (onSearch && searchState.trim()) {
      onSearch(searchState);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="hero">
      <div className="hero_overlay"></div>

      <div className="hero_content">
        <h1>Discover Attractions</h1>

        <p>Discover amazing tourism centres across Nigeria</p>

        <div className="destination_btn" onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}>
          <IoLocationOutline />
          <span>{selectedLocation || "Choose Destination"}</span>
          <IoChevronDown />
        </div>

  
        {locationDropdownOpen && (
          <div className="location-dropdown-menu">
            {LOCATIONS.map((location) => (
              <div
                key={location}
                className="location-dropdown-item"
                onClick={() => handleLocationSelect(location)}
              >
                {location}
              </div>
            ))}
          </div>
        )}

        <div className="search_container">
          <div className="search_input">
            <IoSearchOutline />
            <input
              type="text"
              placeholder="Search centres by state (e.g., Lagos, Abuja)"
              value={searchState}
              onChange={(e) => setSearchState(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
          </div>

          <button className="filter_btn" type="button" onClick={handleSearch} disabled={loading}>
            <CiFilter />
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Discoverpagehero;