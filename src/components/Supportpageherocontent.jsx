import React from "react";
import "../components/css/Supportpagehero.css";

const Supportpageherocontent = () => {
  return (
    <main className="support-section">
      <section className="support-content">
        <div className="support-text">
          <h1>
            Dedicated Support <br />
            Every Step of the Way
          </h1>

          <p>
            We're always here to support you and ensure you have a smooth,
            stress-free, and enjoyable booking experience.
          </p>
        </div>
      </section>

      <section className="support-content-image">
        <div className="support-image">
          <img src="/novaxcape/supportImg.png" alt="" />
        </div>
      </section>
    </main>
  );
};

export default Supportpageherocontent;