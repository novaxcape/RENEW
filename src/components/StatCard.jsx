const icons = {
  ticket: "/novaxcape/box.png",
  revenue: "/novaxcape/dollar.png",
  booking: "/novaxcape/rotate.png",
  rating: "/novaxcape/star.png"
};

const StatCard = ({ title, value, percent, previous, type }) => {
  const isOrange = type === "revenue";

  return (
    <div className="stat-card">
      <div className="stat-header">
        <span className="stat-title">{title}</span>
        <img
          src={icons[type]}
          alt={type}
          className="stat-icon-img"
        />
      </div>

      <div className="stat-value-row">
        <h2 className="stat-value">{value}</h2>
        <span className={`stat-percent${isOrange ? " orange" : ""}`}>
          <span className="stat-arrow">↑</span>
          {percent}
        </span>
      </div>

      <p className="stat-previous">{previous}</p>
    </div>
  );
};

export default StatCard;