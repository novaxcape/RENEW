import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Discoverpagehero from "../components/Discoverpagehero";
import Discoversection from "../components/Discoversection";
import Footer from "../components/Footer";
import { getTouristCentersByState } from "../redox/apiSlice";

const Discoverpage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const queryState = new URLSearchParams(location.search).get("state") || "";
  const [searchState, setSearchState] = useState(queryState);
  const [searchSubmitted, setSearchSubmitted] = useState(false);

  const touristCentres = useSelector((state) => state.api.touristCentres);
  const loading = useSelector((state) => state.api.touristCentresLoading);
  const error = useSelector((state) => state.api.touristCentresError);

  useEffect(() => {
    const query = queryState.trim();
    if (!query) return;
    setSearchState(query);
    setSearchSubmitted(true);
    dispatch(getTouristCentersByState(query));
  }, [dispatch, queryState]);

  const handleSearch = () => {
    const query = searchState.trim();
    if (!query) return;
    setSearchSubmitted(true);
    dispatch(getTouristCentersByState(query));
  };

  return (
    <div>
      <Header />
      <Discoverpagehero
        searchState={searchState}
        setSearchState={setSearchState}
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
