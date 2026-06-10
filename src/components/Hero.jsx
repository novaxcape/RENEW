import React from "react";
import "../components/css/Hero.css";
import { FaSearch, FaCalendarAlt } from "react-icons/fa";
const Hero = () => {
  return (
    <>
      <div className="hero_wrapper">
        <div className="wrapper">
        <div className="right">
          <div className="left">
            <div className="text">
              <div className="text1"><img src="/novaxcape/Explore.png" alt="Explore" /></div>
                <div className="text2"><h2>Explore Nigeria's Most</h2>
                <span>Stunning Place</span>
                </div>
                  <div className="text3">
                    <p>Discover beautiful tourism centres across Nigeria, book tickets instantly, and create memories that matter.</p>
                  </div>
            </div>
          <div className="box">
            <input type="text" placeholder="Where to?" />
            <input type="text"  placeholder="When?" />
            <button>Search</button>
          </div>
<div className="box1">
  <div className="input-wrapper">
    <FaSearch className="icon" />
    <input
      type="text"
      placeholder="Where to?"
      className="input-field"
    />
  </div>



  <div className="input-wrapper">
    <FaCalendarAlt className="icon" />
    <input
      type="text"
      placeholder="When?"
      className="input-field"
    />
  </div>

  <button>Search</button>
</div>
        </div>
          <div className="img">
            
            <img src="/novaxcape/Heros.png" alt=""/>
            
            </div></div></div>
      </div>
    </>
  );
};

export default Hero;
