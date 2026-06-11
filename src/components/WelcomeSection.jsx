// import "./css/WelcomeSection.css";

const WelcomeSection = () => {
  return (
    <section className="welcome-section">

      <div>
        <h1>Welcome back, Admin</h1>

        <p>
          Here's an overview of your bookings,
          tickets and revenue performance.
        </p>
      </div>

      <button className="manage-centre-btn">
        Manage Centre
      </button>

    </section>
  );
};

export default WelcomeSection;