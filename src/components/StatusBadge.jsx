// import "./css/StatusBadge.css";


const StatusBadge = ({ status }) => {
  return (
    <span
      className={`status-badge ${status
        .toLowerCase()
        .replace(/\s+/g, "-")}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;