import React, { useState, useEffect, useRef } from "react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  // Filter locations based on search term
  const filteredLocations = LOCATIONS.filter(location =>
    location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setSearchState(location);
    setLocationDropdownOpen(false);
    setSearchTerm("");
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLocationDropdownOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <section className="hero">
      <div className="hero_overlay"></div>

      <div className="hero_content">
        <h1>Discover Attractions</h1>

        <p>Discover amazing tourism centres across Nigeria</p>

        <div className="location-dropdown-wrapper" ref={dropdownRef}>
          <div 
            className="destination_btn" 
            onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
          >
            <IoLocationOutline />
            <span>{selectedLocation || "Choose Destination"}</span>
            <IoChevronDown className={locationDropdownOpen ? "chevron-rotated" : ""} />
          </div>

          {locationDropdownOpen && (
            <div className="location-dropdown-menu">
              {/* Search input inside dropdown */}
              <div className="dropdown-search-input">
                <IoSearchOutline />
                <input
                  type="text"
                  placeholder="Search locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              </div>

              {/* Location list */}
              <div className="dropdown-location-list">
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((location) => (
                    <div
                      key={location}
                      className={`location-dropdown-item ${
                        selectedLocation === location ? "location-selected" : ""
                      }`}
                      onClick={() => handleLocationSelect(location)}
                    >
                      <IoLocationOutline />
                      <span>{location}</span>
                      {selectedLocation === location && (
                        <span className="checkmark">✓</span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="no-results">No locations found</div>
                )}
              </div>
            </div>
          )}
        </div>

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