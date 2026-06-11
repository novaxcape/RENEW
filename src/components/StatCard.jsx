import {
  FiCreditCard,
  FiDollarSign,
  FiBookOpen,
  FiStar
} from "react-icons/fi";
// import "./css/StatCard.css";
const icons = {
  ticket: <FiCreditCard />,
  revenue: <FiDollarSign />,
  booking: <FiBookOpen />,
  rating: <FiStar />
};

const StatCard = ({
  title,
  value,
  previous,
  type
}) => {
  return (
    <div className="stat-card">

      <div className="stat-icon">
        {icons[type]}
      </div>

      <h4>{title}</h4>

<div className="stat-value-row">
  <h2>{value}</h2>

  <span className="stat-percent">
    +1.8%
  </span>
</div>

<p>{previous}</p>

      <p>{previous}</p>

    </div>
  );
};

export default StatCard;