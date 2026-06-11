import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Family Pack",     value: 22, color: "#f4622a" },
  { name: "Children Ticket", value: 25, color: "#0d2d6e" },
  { name: "Adult Ticket",    value: 35, color: "#a8d4e8" },
  { name: "Total package",   value: 8,  color: "#1e1008" },
];

const legend = [
  { name: "Adult Ticket",    pct: "35%", color: "#a8d4e8" },
  { name: "Children Ticket", pct: "25%", color: "#0d2d6e" },
  { name: "Family Pack",     pct: "22%", color: "#f4622a" },
  { name: "Total package",   pct: "08%", color: "#1e1008" },
];

const TicketDonutChart = () => {
  return (
    <div className="ticket-chart">
      <h3 className="ticket-chart-title">Ticket sold by type</h3>

      <div className="donut-wrapper">
        <div className="donut-chart-container">
          <ResponsiveContainer width={300} height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={108}
                outerRadius={140}
                paddingAngle={0}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" fontSize="40" fontWeight="700" fontFamily="Manrope" fill="#0f172a">88</text>
              <text x="50%" y="57%" textAnchor="middle" dominantBaseline="middle" fontSize="15" fontFamily="Manrope" fill="#64748b">Total</text>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="donut-legend">
          {legend.map((entry, index) => (
            <div className="legend-row" key={index}>
              <span className="legend-dot" style={{ background: entry.color }} />
              <span className="legend-name">{entry.name}</span>
              <span className="legend-pct">{entry.pct}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TicketDonutChart;