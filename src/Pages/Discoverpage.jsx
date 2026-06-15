import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  const [searchState, setSearchState] = useState("");
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");

  const touristCentres = useSelector(selectTouristCentres);
  const loading = useSelector(selectTouristCentresLoading);
  const error = useSelector(selectTouristCentresError);

  const handleSearch = (searchTerm) => {
    const term = (searchTerm || searchState).trim();
    if (!term) return;

    setSearchState(term);
    setSelectedLocation(term);
    setSearchSubmitted(true);
    dispatch(clearApiError());
    dispatch(getTouristCentersByState(term));
  };

  return (
    <div>
      <Discoverpagehero
        searchState={searchState}
        setSearchState={setSearchState}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        onSearch={handleSearch}
      />
      <Discoversection
        searchState={searchState}
        searchSubmitted={searchSubmitted}
        touristCentres={touristCentres}
        loading={loading}
        error={error}
      />
      <Footer />
    </div>
  );
};

export default Discoverpage;
