// File: src/Pages/Discoverpage.jsx

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Discoverpagehero from "../components/Discoverpagehero";
import Discoversection from "../components/Discoversection";
import Footer from "../components/Footer";
import {
  getTouristCentersByState,
  clearApiError,
  selectTouristCentres,
  selectTouristCentresError,
  selectTouristCentresLoading,
} from "../redox/apiSlice";

const Discoverpage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [searchState, setSearchState] = useState("");
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const touristCentres = useSelector(selectTouristCentres);
  const loading = useSelector(selectTouristCentresLoading);
  const error = useSelector(selectTouristCentresError);

  // ✅ Handle search from Hero component via URL parameters
  useEffect(() => {
    // Check if there's a location parameter in the URL
    const queryParams = new URLSearchParams(location.search);
    const locationParam = queryParams.get('location');
    
    // Check if there's state from navigation (from Hero component)
    const stateLocation = location.state?.searchLocation;
    
    // Use location from state first, then URL param, then default
    const searchTerm = stateLocation || locationParam || null;
    
    if (searchTerm) {
      console.log("🔍 Search triggered from Hero with location:", searchTerm);
      setSearchState(searchTerm);
      setSelectedLocation(searchTerm);
      setSearchSubmitted(true);
      setInitialLoadDone(true);
      dispatch(clearApiError());
      dispatch(getTouristCentersByState(searchTerm));
    } else if (!initialLoadDone && !location.state) {
      // Load default state on initial page load
      const defaultState = "Lagos";
      console.log("📄 Loading default state:", defaultState);
      setSearchState(defaultState);
      setSelectedLocation(defaultState);
      setSearchSubmitted(true);
      setInitialLoadDone(true);
      dispatch(clearApiError());
      dispatch(getTouristCentersByState(defaultState));
    }
  }, [dispatch, location, initialLoadDone]);

  // ✅ Handle state passed from PopularDestinations or other components
  useEffect(() => {
    if (location.state) {
      const { searchState: stateSearch, selectedLocation: stateLocation, searchSubmitted: stateSubmitted } = location.state;
      if (stateSearch && !location.state?.searchLocation) {
        console.log("📄 Loading from state:", stateSearch);
        setSearchState(stateSearch);
        setSelectedLocation(stateLocation || stateSearch);
        setSearchSubmitted(true);
        setInitialLoadDone(true);
        dispatch(clearApiError());
        dispatch(getTouristCentersByState(stateSearch));
      }
    }
  }, [location.state, dispatch]);

  const handleSearch = (searchTerm) => {
    const term = (searchTerm || searchState).trim();
    if (!term) return;

    console.log("🔍 Manual search triggered:", term);
    setSearchState(term);
    setSelectedLocation(term);
    setSearchSubmitted(true);
    setInitialLoadDone(true);
    dispatch(clearApiError());
    dispatch(getTouristCentersByState(term));
  };

  // ✅ Function to clear search and show default data
  const handleClearSearch = () => {
    console.log("🔄 Clearing search...");
    setSearchState("");
    setSelectedLocation("");
    setSearchSubmitted(false);
    dispatch(clearApiError());
    // Reload default centres
    const defaultState = "Lagos";
    setSearchState(defaultState);
    setSelectedLocation(defaultState);
    setSearchSubmitted(true);
    dispatch(getTouristCentersByState(defaultState));
  };

  console.log("📄 DiscoverPage - touristCentres:", touristCentres?.length || 0);
  console.log("📄 DiscoverPage - loading:", loading);
  console.log("📄 DiscoverPage - error:", error);
  console.log("📄 DiscoverPage - searchSubmitted:", searchSubmitted);
  console.log("📄 DiscoverPage - searchState:", searchState);

  return (
    <div>
      <Discoverpagehero
        searchState={searchState}
        setSearchState={setSearchState}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        onSearch={handleSearch}
        loading={loading}
      />
      <Discoversection
        searchState={searchState}
        searchSubmitted={searchSubmitted}
        touristCentres={touristCentres}
        loading={loading}
        error={error}
        onClearSearch={handleClearSearch}
      />
      <Footer />
    </div>
  );
};

export default Discoverpage;