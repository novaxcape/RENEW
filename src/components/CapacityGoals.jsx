import "./css/Capacity.css"


const CapacityGoals = () => {
  return (
   <div className="capacity-card">

  <h3>Capacity Goals</h3>

  <div className="capacity-row">
    <span>Lekki Conservation</span>
    <strong>1,200 cap</strong>
  </div>

  <div className="progress-bar">
    <div className="progress-fill"></div>
  </div>

  <p className="goal-info">
    75% filled this week
  </p>

</div>
  );
};

export default CapacityGoals;