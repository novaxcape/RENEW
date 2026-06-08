import React from "react";
import "./css/Recommend.css";

const Recommend = () => {
  return (
    <div className="recommend_wrapper">
      <div className="recommend_body">
        <div className="recommend_content">
          <div className="recommend_left">
            <img
              src="/novaxcape/Recommendbg.png"
              alt="recommend"
            />
          </div>

          <div className="recommend_right">
            <span className="recommend_tag">
              What we Recommend
            </span>

            <h2>
              We Recommend
              <br />
              Beautiful Destinations
              Every Month
            </h2>

            <p>
              Let's choose your dream destinations here.
              We provide many locations and the best
              destination every week.
            </p>

            <div className="statsRowGroup">
              <div className="statBlockCard">
                <div className="statValueNumber">2000+</div>
                <div className="statValueLabel">Our Explorers</div>
              </div>

              <div className="statBlockCard">
                <div className="statValueNumber">100+</div>
                <div className="statValueLabel">Destinations</div>
              </div>

              <div className="statBlockCard">
                <div className="statValueNumber">20+</div>
                <div className="statValueLabel">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommend;