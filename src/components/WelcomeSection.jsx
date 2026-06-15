const WelcomeSection = () => {
  const storedName = localStorage.getItem("Names");

  return (
    <section className="welcome-section">
      <div>
        <h1>Welcome back, {storedName}</h1>
        <p>
          Here's an overview of your bookings, tickets and revenue performance
        </p>
      </div>
      <button className="manage-centre-btn">
        Manage Centre
      </button>
    </section>
  );
};

export default WelcomeSection;