// components/WelcomeSection.jsx
import { useSelector } from "react-redux";

const WelcomeSection = () => {
  // Get vendor name from Redux state
  const { loggedInUser, isVendor } = useSelector((state) => state.auth);
  
  // Get vendor name from Redux state
  const displayName = isVendor 
    ? loggedInUser?.vendorName || loggedInUser?.name || "Vendor" 
    : "Vendor";

  return (
    <section className="welcome-section">
      <div>
        <h1>Welcome back, {displayName}</h1>
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