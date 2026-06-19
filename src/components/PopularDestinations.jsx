import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/PopularDestinations.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://novaxcape.onrender.com/api/v1";

// Static fallback images
const cityImages = {
  Lagos: "/novaxcape/lagos.jpg",
  Ibadan: "/novaxcape/Ibadan.jpg",
  Abuja: "/novaxcape/abuja.jpg",
  "Port Harcourt": "/novaxcape/port.jpg",
};

const popularCities = [
  "Lagos",
  "Ibadan",
  "Abuja",
  "Port Harcourt",
];

const PopularDestinations = () => {
  const navigate = useNavigate();

  const [citiesData, setCitiesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCitiesData();
  }, []);

  const getValidCentres = (centres) => {
    if (!centres || !Array.isArray(centres)) return [];

    return centres.filter((centre) => {
      if (!centre) return false;

      const hasKeys = Object.keys(centre).length > 0;

      const hasData =
        centre.centreName ||
        centre.name ||
        centre.title ||
        centre.id ||
        centre._id ||
        centre.centreId ||
        centre.city ||
        centre.state ||
        centre.location;

      return hasKeys && hasData;
    });
  };

  const fetchCitiesData = async () => {
    setLoading(true);
    setError(null);

    try {
      const citiesPromises = popularCities.map(async (city) => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/tourist/get-all-state/${encodeURIComponent(city)}`
          );

          if (response.ok) {
            const data = await response.json();

            const centres = data?.data || [];

            const validCentres = getValidCentres(centres);

            return {
              name: city,
              centreCount: validCentres.length,
              image:
                cityImages[city] ||
                "/novaxcape/placeholder.png",
            };
          }

          return {
            name: city,
            centreCount: 0,
            image:
              cityImages[city] ||
              "/novaxcape/placeholder.png",
          };
        } catch {
          return {
            name: city,
            centreCount: 0,
            image:
              cityImages[city] ||
              "/novaxcape/placeholder.png",
          };
        }
      });

      const results = await Promise.all(citiesPromises);

      setCitiesData(results);
    } catch {
      setError("Failed to load destinations");
    } finally {
      setLoading(false);
    }
  };

  const handleCityClick = (cityName) => {
    navigate("/discover", {
      state: {
        searchState: cityName,
        selectedLocation: cityName,
        searchSubmitted: true,
      },
    });
  };

  if (loading) {
    return (
      <section className="popular-destination">
        <div className="popular-destination__header">
          <h2 className="popular-destination__title">
            Popular Destination
          </h2>
          <p className="popular-destination__subtitle">
            Explore Top Cities with the most attractions
          </p>
        </div>

        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading destinations...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="popular-destination">
        <div className="popular-destination__header">
          <h2 className="popular-destination__title">
            Popular Destination
          </h2>
          <p className="popular-destination__subtitle">
            Explore Top Cities with the most attractions
          </p>
        </div>

        <div className="error-container">
          <p>{error}</p>
          <button
            className="retry-btn"
            onClick={fetchCitiesData}
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="popular-destination">
      <div className="popular-destination__header">
        <h2 className="popular-destination__title">
          Popular Destination
        </h2>

        <p className="popular-destination__subtitle">
          Explore Top Cities with the most attractions
        </p>
      </div>

      <div className="popular-destination__grid">
        {citiesData.map((city) => (
          <div
            key={city.name}
            className="popular-destination__card"
            onClick={() => handleCityClick(city.name)}
          >
            <img
              src={city.image}
              alt={city.name}
              className="popular-destination__image"
            />

            <div className="popular-destination__overlay">
              <div className="popular-destination__info">
                <h3>{city.name}</h3>
                <p>{city.centreCount} Attractions</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularDestinations;