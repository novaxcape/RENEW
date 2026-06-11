import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Adult Ticket",
    value: 35,
  },
  {
    name: "Children Ticket",
    value: 25,
  },
  {
    name: "Family Pack",
    value: 22,
  },
  {
    name: "VIP",
    value: 8,
  },
];

const COLORS = [
  "#B5D8F7",
  "#0D47A1",
  "#FF6B35",
  "#2E1A12",
];

const TicketDonutChart = () => {
  return (
    <div className="ticket-chart">

      <h3>Ticket Sold By Type</h3>

      <ResponsiveContainer
        width="100%"
        height={250}
      >
        <PieChart>

          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index]}
              />
            ))}
          </Pie>

          {/* Center Number */}
          <text
            x="50%"
            y="47%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="32"
            fontWeight="700"
            fill="#0f172a"
          >
            88
          </text>

          {/* Center Label */}
          <text
            x="50%"
            y="58%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="14"
            fill="#64748b"
          >
            Total
          </text>

        </PieChart>
      </ResponsiveContainer>

      <div className="ticket-legend">

        <div>
          <span
            className="legend-dot"
            style={{ background: "#B5D8F7" }}
          />
          Adult Ticket 35%
        </div>

        <div>
          <span
            className="legend-dot"
            style={{ background: "#0D47A1" }}
          />
          Children Ticket 25%
        </div>

        <div>
          <span
            className="legend-dot"
            style={{ background: "#FF6B35" }}
          />
          Family Pack 22%
        </div>

        <div>
          <span
            className="legend-dot"
            style={{ background: "#2E1A12" }}
          />
          VIP 8%
        </div>

      </div>

    </div>
  );
};

export default TicketDonutChart;