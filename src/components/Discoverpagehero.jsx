import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { IoLocationOutline } from "react-icons/io5";
import { IoSearchOutline } from "react-icons/io5";
import { CiFilter } from "react-icons/ci";
import { IoChevronDown } from "react-icons/io5";
import { getTouristCentersByState } from "../redox/apiSlice";
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

const Discoverpagehero = ({ searchState, setSearchState, onSearch, setSearchSubmitted, setTouristCentres, setLoading, setError }) => {
  const dispatch = useDispatch();
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setSearchState(location);
    setLocationDropdownOpen(false);
    // Auto search when location is selected
    performSearch(location);
  };

  const performSearch = async (searchTerm) => {
    const term = searchTerm?.trim() || searchState?.trim();
    
    if (!term) {
      console.log("Please enter a state to search");
      return;
    }

    setLoading(true);
    setError(null);
    setSearchSubmitted(true);

    try {
      const result = await dispatch(getTouristCentersByState(term)).unwrap();
      const centers = result?.data || result?.tourists || result || [];
      setTouristCentres(centers);
      
      // Call the onSearch callback if provided
      if (onSearch) onSearch(term);
      
    } catch (error) {
      console.error("Search error:", error);
      setError(error.message || "No centers found in this state");
      setTouristCentres([]);
      if (onSearch) onSearch(term);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    performSearch();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  };

  return (
    <section className="hero">
      <div className="hero_overlay"></div>

      <div className="hero_content">
        <h1>Discover Attractions</h1>

        <p>Discover amazing tourism centres across Nigeria</p>

        {/* Location Dropdown */}
        <div className="destination_btn" onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}>
          <IoLocationOutline />
          <span>{selectedLocation || "Choose Destination"}</span>
          <IoChevronDown />
        </div>

        {/* Dropdown Menu */}
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

        {/* Search Bar */}
        <div className="search_container">
          <div className="search_input">
            <IoSearchOutline />
            <input
              type="text"
              placeholder="Search centres by state (e.g., Lagos, Abuja)"
              value={searchState}
              onChange={(e) => setSearchState(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <button className="filter_btn" type="button" onClick={handleSearch}>
            <CiFilter />
            Search
          </button>
        </div>
      </div>
    </section>
  );
};

export default Discoverpagehero;