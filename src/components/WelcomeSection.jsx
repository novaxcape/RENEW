const WelcomeSection = ({ vendorName, centreCount }) => {
  return (
    <section className="welcome-section">
      <div>
        <h1>Welcome back, {vendorName || 'Vendor'}!</h1>
        <p>
          You have {centreCount || 0} tourism centre(s) on NovaEscape. 
          Here's an overview of your bookings, tickets, and revenue performance.
        </p>
      </div>
      <button className="manage-centre-btn">
        Manage Centre
      </button>
    </section>
  );
};

export default WelcomeSection;