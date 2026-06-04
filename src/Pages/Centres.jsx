import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Centres = () => {
  return (
    <main className="centres-page">
      <Header />
      <section className="page-section">
        <div className="page-content">
          <h1>For Centres</h1>
          <p>
            Learn how Novaxcape helps centres manage bookings, attraction
            listings, and guest experiences.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Centres;
