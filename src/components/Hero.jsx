import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../components/css/Hero.css";
import { FaCalendarAlt } from "react-icons/fa";
import axios from "axios";

const ROTATING_TEXTS = [
  "Stunning Places",
  "Hidden Gems",
  "Iconic Spots",
  "Beautiful Destination",
];

const LOCATIONS = [
  "Lagos",
  "Abuja",
  "Port Harcourt",
  "Calabar",
  "Kastina",
  "Enugu",
  "Ibadan",
  "Ogun",
];

const CalendarPicker = ({ onSelect, selectedDate, onClose }) => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const prevDays = new Date(viewYear, viewMonth, 0).getDate();

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--)
    cells.push({ day: prevDays - i, type: "prev" });
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ day: d, type: "current" });
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) cells.push({ day: d, type: "next" });

  const isToday = (day, type) =>
    type === "current" &&
    day === today.getDate() &&
    viewMonth === today.getMonth() &&
    viewYear === today.getFullYear();

  const isSelected = (day, type) =>
    selectedDate &&
    type === "current" &&
    selectedDate.getDate() === day &&
    selectedDate.getMonth() === viewMonth &&
    selectedDate.getFullYear() === viewYear;

  const handlePrev = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  
  const handleNext = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const handleDateSelect = (day, type) => {
    if (type === "current") {
      onSelect(new Date(viewYear, viewMonth, day));
      onClose(); // Close calendar after selection
    }
  };

  return (
    <div className="cal-picker">
      <div className="cal-header">
        <button className="cal-nav" onClick={handlePrev} type="button">&#8249;</button>
        <span className="cal-month-label">
          {monthNames[viewMonth]} {viewYear}
        </span>
        <button className="cal-nav" onClick={handleNext} type="button">&#8250;</button>
      </div>
      <div className="cal-grid">
        {dayNames.map((d) => (
          <div key={d} className="cal-day-name">{d}</div>
        ))}
        {cells.map((cell, i) => (
          <div
            key={i}
            className={`cal-cell ${cell.type !== "current" ? "cal-cell--other" : ""} ${
              isToday(cell.day, cell.type) ? "cal-cell--today" : ""
            } ${isSelected(cell.day, cell.type) ? "cal-cell--selected" : ""}`}
            onClick={() => handleDateSelect(cell.day, cell.type)}
          >
            {cell.day}
          </div>
        ))}
      </div>
    </div>
  );
};

const Hero = () => {
  const navigate = useNavigate();
  const [textIndex, setTextIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [locationOpen, setLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [calOpen, setCalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);

  // Refs for click outside handling
  const locationRef = useRef(null);
  const calRef = useRef(null);
  const locationMobileRef = useRef(null);
  const calMobileRef = useRef(null);

  // Rotating text animation
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setTextIndex((i) => (i + 1) % ROTATING_TEXTS.length);
        setFade(true);
      }, 400);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Handle click outside
  useEffect(() => {
    const handler = (e) => {
      if (locationRef.current && !locationRef.current.contains(e.target)) {
        setLocationOpen(false);
      }
      if (calRef.current && !calRef.current.contains(e.target)) {
        setCalOpen(false);
      }
      if (locationMobileRef.current && !locationMobileRef.current.contains(e.target)) {
        setLocationOpen(false);
      }
      if (calMobileRef.current && !calMobileRef.current.contains(e.target)) {
        setCalOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const formatDate = (date) => {
    if (!date) return "When?";
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long", 
      year: "numeric",
    });
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setLocationOpen(false);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setCalOpen(false);
  };

  const handleSearch = async () => {
    if (!selectedLocation) {
      alert("Please select a location first");
      return;
    }

    setLoading(true);
    
    try {
      // Call the API to get tourist centers by state
      const response = await axios.get(
        `https://novaxcape.onrender.com/api/v1/tourist/get-all-state/${encodeURIComponent(selectedLocation)}`
      );
      
      // Navigate to discover page with results
      navigate("/discover", {
        state: { 
          centers: response.data,
          state: selectedLocation,
          selectedDate: selectedDate ? formatDate(selectedDate) : null,
          searchParams: {
            location: selectedLocation,
            date: selectedDate
          }
        }
      });
    } catch (error) {
      console.error("Error fetching centers:", error);
      // Even if API fails, navigate with location
      navigate("/discover", {
        state: { 
          state: selectedLocation,
          selectedDate: selectedDate ? formatDate(selectedDate) : null,
          error: error.response?.data?.message || "Unable to fetch centers. Please try again.",
          searchParams: {
            location: selectedLocation,
            date: selectedDate
          }
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero_wrapper">
      <div className="hero_inner">
        {/* LEFT */}
        <div className="hero_left">
          <div className="hero_tagline">
            <img src="/novaxcape/Explore.png" alt="Explore Nigeria's hidden gems" />
          </div>

          <div className="hero_headline">
            <h2 className="hero_headline_static">Explore Nigeria's Most</h2>
            <span className={`hero_headline_rotating ${fade ? "fade-in" : "fade-out"}`}>
              {ROTATING_TEXTS[textIndex]}
            </span>
          </div>

          <p className="hero_description">
            Discover beautiful tourism centres across Nigeria, book tickets
            instantly, and create memories that matter.
          </p>

          {/* DESKTOP SEARCH */}
          <div className="search_row">
            <div className="search_glass">
              {/* Location Dropdown */}
              <div className="search_pill_wrapper" ref={locationRef}>
                <button
                  className="search_pill search_pill--grey"
                  onClick={() => {
                    setLocationOpen(!locationOpen);
                    setCalOpen(false);
                  }}
                  type="button"
                >
                  <span>{selectedLocation || "Where to?"}</span>
                </button>
                {locationOpen && (
                  <div className="dropdown_list">
                    {LOCATIONS.map((loc) => (
                      <div
                        key={loc}
                        className="dropdown_item"
                        onClick={() => handleLocationSelect(loc)}
                      >
                        {loc}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Date Picker */}
              <div className="search_pill_wrapper" ref={calRef}>
                <button
                  className="search_pill search_pill--grey"
                  onClick={() => {
                    setCalOpen(!calOpen);
                    setLocationOpen(false);
                  }}
                  type="button"
                >
                  <FaCalendarAlt className="search_pill_icon" />
                  <span>{formatDate(selectedDate)}</span>
                </button>
                {calOpen && (
                  <CalendarPicker
                    selectedDate={selectedDate}
                    onSelect={handleDateSelect}
                    onClose={() => setCalOpen(false)}
                  />
                )}
              </div>

              {/* Search Button */}
              <button
                className="search_btn_orange"
                type="button"
                onClick={handleSearch}
                disabled={loading || !selectedLocation}
                style={{ opacity: loading || !selectedLocation ? 0.6 : 1 }}
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT Desktop Image */}
        <div className="hero_right">
          <img src="/novaxcape/Heros.png" alt="Nigeria destinations" />
        </div>
      </div>

      {/* MOBILE SEARCH */}
      <div className="search_mobile">
        {/* Location Dropdown Mobile */}
        <div className="search_mobile_pill_wrapper" ref={locationMobileRef}>
          <button
            className="search_mobile_pill"
            onClick={() => {
              setLocationOpen(!locationOpen);
              setCalOpen(false);
            }}
            type="button"
          >
            <span>{selectedLocation || "Where to?"}</span>
          </button>
          {locationOpen && (
            <div className="dropdown_list dropdown_list--mobile">
              {LOCATIONS.map((loc) => (
                <div
                  key={loc}
                  className="dropdown_item"
                  onClick={() => handleLocationSelect(loc)}
                >
                  {loc}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Date Picker Mobile */}
        <div className="search_mobile_pill_wrapper" ref={calMobileRef}>
          <button
            className="search_mobile_pill"
            onClick={() => {
              setCalOpen(!calOpen);
              setLocationOpen(false);
            }}
            type="button"
          >
            <FaCalendarAlt className="search_mobile_icon" />
            <span>{formatDate(selectedDate)}</span>
          </button>
          {calOpen && (
            <CalendarPicker
              selectedDate={selectedDate}
              onSelect={handleDateSelect}
              onClose={() => setCalOpen(false)}
            />
          )}
        </div>

        {/* Search Button Mobile */}
        <button
          className="search_mobile_pill search_mobile_pill--orange"
          type="button"
          onClick={handleSearch}
          disabled={loading || !selectedLocation}
          style={{ opacity: loading || !selectedLocation ? 0.6 : 1 }}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* MOBILE IMAGE */}
      <div className="hero_right_mobile">
        <img src="/novaxcape/Heros.png" alt="Nigeria destinations" />
      </div>
    </div>
  );
};

export default Hero;