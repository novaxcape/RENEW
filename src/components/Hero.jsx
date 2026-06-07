import React, { useState } from "react";
import Select from "react-select";
import "./css/Hero.css";
import { FaLocationDot } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";

const locations = [
  { value: "lagos", label: "Lagos" },
  { value: "ibadan", label: "Ibadan" },
  { value: "abuja", label: "Abuja" },
  { value: "portharcourt", label: "Port Harcourt" },
  { value: "enugu", label: "Enugu" },
  { value: "owerri", label: "Owerri" },
  { value: "uyo", label: "Uyo" },
  { value: "jos", label: "Jos" },
  { value: "calabar", label: "Calabar" },
  { value: "kaduna", label: "Kaduna" },
];

const Hero = () => {
  const [location, setLocation] = useState(null);
  const [travelDate, setTravelDate] = useState("");

  const handleSearch = () => {
    console.log({
      location: location?.value,
      travelDate,
    });
  };

  return (
    <div className="hero_wrapper">
      <div className="hero_body">
        <div className="hero_left">
          <div className="hero_badge">
            <img src="/novaxcape/Explore.png" alt="Badge" />
          </div>

          <div className="hero_text">
            <h1>
              Explore Nigeria's Most
              <span> Stunning Places</span>
            </h1>

            <p>
              Discover beautiful tourist centres across Nigeria,
              book tickets instantly, and create memories that matter.
            </p>

            {/* ===== EXACT SEARCH BAR ===== */}
            <div className="hero_search">
              
              {/* Location Pill */}
              <div className="search_pill search_pill_location">
                <FaLocationDot className="pill_icon" />
                <Select
                  className="location_select"
                  classNamePrefix="react-select"
                  options={locations}
                  value={location}
                  onChange={setLocation}
                  placeholder="Where to?"
                  isSearchable
                  isClearable
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                />
              </div>

              {/* Date Pill */}
              <div className="search_pill search_pill_date">
                <FaCalendarAlt className="pill_icon" />
                <input
                  type="date"
                  className="date_input"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  placeholder="When?"
                />
              </div>

              {/* Search Button */}
              <button className="search_btn" onClick={handleSearch}>
                Search
              </button>

            </div>
          </div>
        </div>

        <div className="hero_right">
          <img src="/novaxcape/Heros.png" alt="Hero" />
        </div>
      </div>
    </div>
  );
};

export default Hero;