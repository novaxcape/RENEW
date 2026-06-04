import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Discover = () => {
  return (
    <main className="discover-page">
      <Header />
      <section className="page-section">
        <div className="page-content">
          <h1>Discover</h1>
          <p>
            Explore the best attractions, experiences, and recommendations on
            Novaxcape.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Discover;
