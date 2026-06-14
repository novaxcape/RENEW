import React, { useState } from "react";
import Discoverpagehero from "../components/Discoverpagehero";
import Discoversection from "../components/Discoversection";
import Footer from "../components/Footer";

const Discoverpage = () => {
  // State for search functionality
  const [searchState, setSearchState] = useState("");
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [touristCentres, setTouristCentres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handler for search
  const handleSearch = (searchTerm) => {
    setSearchState(searchTerm);
    setSearchSubmitted(true);
  };

  return (
    <div>
      <Discoverpagehero 
        searchState={searchState}
        setSearchState={setSearchState}
        onSearch={handleSearch}
        setSearchSubmitted={setSearchSubmitted}
        setTouristCentres={setTouristCentres}
        setLoading={setLoading}
        setError={setError}
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