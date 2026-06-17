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

  const touristCentres = useSelector(selectTouristCentres);
  const loading = useSelector(selectTouristCentresLoading);
  const error = useSelector(selectTouristCentresError);

  // Handle state passed from PopularDestinations or other components
  useEffect(() => {
    if (location.state) {
      const { searchState: stateSearch, selectedLocation: stateLocation, searchSubmitted: stateSubmitted } = location.state;
      if (stateSearch) {
        setSearchState(stateSearch);
        setSelectedLocation(stateLocation || stateSearch);
        setSearchSubmitted(true);
        dispatch(clearApiError());
        dispatch(getTouristCentersByState(stateSearch));
      }
    }
  }, [location.state, dispatch]);

  const handleSearch = (searchTerm) => {
    const term = (searchTerm || searchState).trim();
    if (!term) return;

    setSearchState(term);
    setSelectedLocation(term);
    setSearchSubmitted(true);
    dispatch(clearApiError());
    dispatch(getTouristCentersByState(term));
  };

  // ✅ Function to clear search and show all static data
  const handleClearSearch = () => {
    setSearchState("");
    setSelectedLocation("");
    setSearchSubmitted(false);
    dispatch(clearApiError());
  };

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
        onClearSearch={handleClearSearch}  // ✅ Pass the clear function
      />
      <Footer />
    </div>
  );
};

export default Discoverpage;