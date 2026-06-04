import React from "react";
import { AiFillStar } from "react-icons/ai";
import { LuTrendingUp } from "react-icons/lu";
import { FiTrendingUp } from "react-icons/fi";
import "./css/Attractions.css";

const attractionsData = [
  {
    id: 1,
    title: "Lekki Conservation Centre",
    location: "Lagos",
    rating: 5.0,
    reviews: 567,
    isTrending: true,
    image: "/novaxcape/lekki.png",
    alt: "Lekki Conservation Centre",
  },
  {
    id: 2,
    title: "Yankari National Park",
    location: "Bauchi",
    rating: 4.0,
    reviews: 213,
    isTrending: true,
    image: "/novaxcape/yankari.png",
    alt: "Yankari National Park",
  },
  {
    id: 3,
    title: "Olumo Rock",
    location: "Abeokuta",
    rating: 5.0,
    reviews: 400,
    isTrending: false,
    image: "/novaxcape/olumo.png",
    alt: "Olumo Rock",
  },
  {
    id: 4,
    title: "Obudu Mountain Resort",
    location: "Cross River",
    rating: 4.5,
    reviews: 200,
    isTrending: true,
    image: "/novaxcape/obudu.png",
    alt: "Obudu Mountain Resort",
  },
  {
    id: 5,
    title: "Green Legacy Resort",
    location: "Abeokuta",
    rating: 4.0,
    reviews: 122,
    isTrending: false,
    image: "/novaxcape/green.png",
    alt: "Green Legacy Resort",
  },
  {
    id: 6,
    title: "Omu Resort",
    location: "Lagos",
    rating: 5.0,
    reviews: 567,
    isTrending: true,
    image: "/novaxcape/omu.png",
    alt: "Omu Resort",
  },
];

const filterType = "all"; // change to 'trending' if you want only trending cards
const filteredAttractions = attractionsData.filter(
  (item) =>
    filterType === "all" || (filterType === "trending" && item.isTrending),
);

const Attractions = () => {
  return (
    <div className="attractionsSection">
      <div className="attractionsHeader">
        <div className="sectionMainTitle">
          <LuTrendingUp className="titleTrendIcon" />
          Top Attractions
        </div>
        <div className="sectionSubDescription">
          Most visited and highly rated tourism centres this month
        </div>
      </div>

      <div className="attractionsGrid">
        {filteredAttractions.map((attraction) => (
          <div key={attraction.id} className="attractionCard">
            <div className="cardImageWrapper">
              {attraction.isTrending && (
                <div className="trendingBadgeTag">
                  <FiTrendingUp className="badgeTrendIcon" />
                  Trending
                </div>
              )}
              <img
                src={attraction.image}
                alt={attraction.alt}
                className="cardDisplayImage"
              />
            </div>
            <div className="cardDetailsContent">
              <div className="attractionItemTitle">{attraction.title}</div>
              <div className="attractionItemLocation">
                {attraction.location}
              </div>
              <div className="ratingFlexGroup">
                <div className="starsRow">
                  <AiFillStar className="starIcon" />
                  <AiFillStar className="starIcon" />
                  <AiFillStar className="starIcon" />
                  <AiFillStar className="starIcon" />
                  <AiFillStar className="starIcon" />
                </div>
                <div className="ratingNumericalValue">
                  {attraction.rating.toFixed(1)}
                </div>
                <div className="reviewsCountTotal">({attraction.reviews})</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Attractions;
