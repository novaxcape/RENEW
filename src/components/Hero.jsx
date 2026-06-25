// File: src/components/Hero.jsx

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../components/css/Hero.css";
import { FaCalendarAlt } from "react-icons/fa";
import {
  selectPackages,
  selectTouristCentres,
  selectVendorCentres,
} from "../redox/apiSlice";

const ROTATING_TEXTS = [
  "Stunning Places",
  "Hidden Gems",
  "Iconic Spots",
  "Beautiful Destination",
];

// Fallback list, used only if nothing useful is in Redux yet
const FALLBACK_LOCATIONS = [
  "Lagos", "Abuja", "Port Harcourt", "Calabar",
  "Kastina", "Enugu", "Ibadan", "Ogun",
];

const extractState = (item) =>
  item?.state || item?.location || item?.stateName || item?.centreState || null;

const CalendarPicker = ({ onSelect, selectedDate }) => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const prevDays = new Date(viewYear, viewMonth, 0).getDate();

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: prevDays - i, type: "prev" });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, type: "current" });
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
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const handleNext = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  return (
    <div className="cal-picker">
      <div className="cal-header">
        <button type="button" className="cal-nav" onClick={handlePrev}>&#8249;</button>
        <span className="cal-month-label">{monthNames[viewMonth]} {viewYear}</span>
        <button type="button" className="cal-nav" onClick={handleNext}>&#8250;</button>
      </div>
      <div className="cal-grid">
        {dayNames.map(d => (
          <div key={d} className="cal-day-name">{d}</div>
        ))}
        {cells.map((cell, i) => (
          <div
            key={i}
            className={[
              "cal-cell",
              cell.type !== "current" ? "cal-cell--other" : "",
              isToday(cell.day, cell.type) ? "cal-cell--today" : "",
              isSelected(cell.day, cell.type) ? "cal-cell--selected" : "",
            ].join(" ").trim()}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (cell.type === "current") onSelect(new Date(viewYear, viewMonth, cell.day));
            }}
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
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [calOpen, setCalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // ---- Pull whatever's already loaded in Redux and derive unique states ----
  const packages = useSelector(selectPackages) || [];
  const touristCentres = useSelector(selectTouristCentres) || [];
  const vendorCentres = useSelector(selectVendorCentres) || [];

  const LOCATIONS = useMemo(() => {
    const all = [...packages, ...touristCentres, ...vendorCentres];
    const states = all
      .map(extractState)
      .filter(Boolean)
      .map((s) => s.trim());

    const unique = Array.from(new Set(states));
    return unique.length > 0 ? unique.sort() : FALLBACK_LOCATIONS;
  }, [packages, touristCentres, vendorCentres]);

  // Desktop refs
  const locationRef = useRef(null);
  const calRef = useRef(null);

  // Mobile refs
  const locationMobileRef = useRef(null);
  const calMobileRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setTextIndex(i => (i + 1) % ROTATING_TEXTS.length);
        setFade(true);
      }, 400);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Outside-click handler — ignores clicks on dropdown items and calendar
  // cells so it never races with / swallows their own selection handlers.
  useEffect(() => {
    const handler = (e) => {
      if (e.target.closest(".dropdown_item") || e.target.closest(".cal-cell")) return;

      if (locationRef.current && !locationRef.current.contains(e.target)) setLocationOpen(false);
      if (calRef.current && !calRef.current.contains(e.target)) setCalOpen(false);
      if (locationMobileRef.current && !locationMobileRef.current.contains(e.target)) setLocationOpen(false);
      if (calMobileRef.current && !calMobileRef.current.contains(e.target)) setCalOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const formatDate = (date) =>
    date
      ? date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
      : null;

  // ✅ Updated search handler - navigates to Discover page with location
  const handleSearch = () => {
    console.log("🔍 Search triggered:", { selectedLocation, selectedDate });
    
    // If location is selected, navigate to discover with the location filter
    if (selectedLocation) {
      navigate(`/discover?location=${encodeURIComponent(selectedLocation)}`, {
        state: { 
          searchLocation: selectedLocation,
          searchDate: selectedDate 
        }
      });
    } else {
      // If no location selected, just go to discover page
      navigate('/discover');
    }
  };

  const selectLocation = (loc) => {
    console.log("📍 Location selected:", loc);
    setSelectedLocation(loc);
    setLocationOpen(false);
  };

  const selectDate = (date) => {
    console.log("📅 Date selected:", date);
    setSelectedDate(date);
    setCalOpen(false);
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
            Discover beautiful tourism centres across Nigeria, book tickets instantly,
            and create memories that matter.
          </p>

          {/* DESKTOP SEARCH */}
          <div className="search_row">
            <div className="search_glass">

              <div className="search_pill_wrapper" ref={locationRef}>
                <button
                  type="button"
                  className="search_pill search_pill--grey"
                  onClick={() => { setLocationOpen(o => !o); setCalOpen(false); }}
                >
                  <span>{selectedLocation || "Where to?"}</span>
                </button>
                {locationOpen && (
                  <div className="dropdown_list">
                    {LOCATIONS.map(loc => (
                      <div
                        key={loc}
                        className="dropdown_item"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          selectLocation(loc);
                        }}
                      >
                        {loc}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="search_pill_wrapper" ref={calRef}>
                <button
                  type="button"
                  className="search_pill search_pill--grey"
                  onClick={() => { setCalOpen(o => !o); setLocationOpen(false); }}
                >
                  <FaCalendarAlt className="search_pill_icon" />
                  <span>{selectedDate ? formatDate(selectedDate) : "When?"}</span>
                </button>
                {calOpen && (
                  <CalendarPicker
                    selectedDate={selectedDate}
                    onSelect={selectDate}
                  />
                )}
              </div>

              <button type="button" className="search_btn_orange" onClick={handleSearch}>
                Search
              </button>

            </div>
          </div>

        </div>

        {/* RIGHT */}
        <div className="hero_right">
          <img src="/novaxcape/Heros.png" alt="Nigeria destinations" />
        </div>

      </div>

      {/* MOBILE SEARCH — above the image */}
      <div className="search_mobile">

        <div className="search_mobile_pill_wrapper" ref={locationMobileRef}>
          <button
            type="button"
            className="search_mobile_pill"
            onClick={() => { setLocationOpen(o => !o); setCalOpen(false); }}
          >
            <span>{selectedLocation || "Where to?"}</span>
          </button>
          {locationOpen && (
            <div className="dropdown_list dropdown_list--mobile">
              {LOCATIONS.map(loc => (
                <div
                  key={loc}
                  className="dropdown_item"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    selectLocation(loc);
                  }}
                >
                  {loc}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="search_mobile_pill_wrapper" ref={calMobileRef}>
          <button
            type="button"
            className="search_mobile_pill"
            onClick={() => { setCalOpen(o => !o); setLocationOpen(false); }}
          >
            <FaCalendarAlt className="search_mobile_icon" />
            <span>{selectedDate ? formatDate(selectedDate) : "When?"}</span>
          </button>
          {calOpen && (
            <CalendarPicker
              selectedDate={selectedDate}
              onSelect={selectDate}
            />
          )}
        </div>

        <button
          type="button"
          className="search_mobile_pill search_mobile_pill--orange"
          onClick={handleSearch}
        >
          Search
        </button>

      </div>

      {/* MOBILE IMAGE — below search */}
      <div className="hero_right_mobile">
        <img src="/novaxcape/Heros.png" alt="Nigeria destinations" />
      </div>

    </div>
  );
};

export default Hero;