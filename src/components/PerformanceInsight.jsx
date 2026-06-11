import { FiTrendingUp } from "react-icons/fi";
// import "./css/Performance.css";
const PerformanceInsight = () => {
  return (
    <div className="performance-card">

      <div className="performance-icon">
        <FiTrendingUp />
      </div>

      <h3>Weekly Performance Insight</h3>

      <p>
        Your centre recorded 24% more bookings
        this week compared to last week.
      </p>
      <p>
  Your centre recorded 24% more bookings
  this week compared to last week.
  Great job attracting more visitors!
</p>

      <button className="review-btn">
        Review Analytics
      </button>

    </div>
  );
};

export default PerformanceInsight;