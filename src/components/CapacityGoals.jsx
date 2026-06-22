// components/CapacityGoals.jsx
const CapacityGoals = ({ 
  centreName = "Lekki Conservation",
  capacity = 1200,
  filled = 900,
  percentage = 75,
  title = "Capacity goals"
}) => {
  // Calculate percentage if not provided
  const calculatedPercentage = percentage || Math.round((filled / capacity) * 100);
  const displayPercentage = Math.min(calculatedPercentage, 100);

  return (
    <div className="capacity-card">
      <div className="capacity-header">
        <h3>{title}</h3>
        <button className="capacity-menu">⋮</button>
      </div>

      <div className="capacity-row">
        <span>{centreName}</span>
        <strong>{capacity.toLocaleString()} cap</strong>
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${displayPercentage}%` }}
        ></div>
      </div>

      <p className="goal-info">{displayPercentage}% filled this week</p>
    </div>
  );
};

export default CapacityGoals;