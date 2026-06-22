import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

const defaultData = [
  { name: "Family Pack", value: 22, color: "#f4622a" },
  { name: "Children Ticket", value: 25, color: "#0d2d6e" },
  { name: "Adult Ticket", value: 35, color: "#a8d4e8" },
  { name: "Total package", value: 8, color: "#1e1008" },
];

const defaultLegend = [
  { name: "Adult Ticket", pct: "35%", color: "#a8d4e8" },
  { name: "Children Ticket", pct: "25%", color: "#0d2d6e" },
  { name: "Family Pack", pct: "22%", color: "#f4622a" },
  { name: "Total package", pct: "08%", color: "#1e1008" },
];

const TicketDonutChart = ({
  data = defaultData,
  legend = defaultLegend,
  total = 88,
  title = "Ticket sold by type",
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const chartSize = isMobile ? 156 : 300;
  const innerRadius = isMobile ? 56 : 108;
  const outerRadius = isMobile ? 72 : 140;
  const valueFontSize = isMobile ? 22 : 40;
  const labelFontSize = isMobile ? 10 : 15;

  return (
    <div className="ticket-chart">
      <h3 className="ticket-chart-title">{title}</h3>

      <div className="donut-wrapper">
        <div className="donut-chart-container">
          <ResponsiveContainer width={chartSize} height={chartSize}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
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
              <text
                x="50%"
                y="46%"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={valueFontSize}
                fontWeight="700"
                fontFamily="Manrope"
                fill="#0f172a"
              >
                {total}
              </text>
              <text
                x="50%"
                y="57%"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={labelFontSize}
                fontFamily="Manrope"
                fill="#64748b"
              >
                Total
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="donut-legend">
          {legend.map((entry, index) => (
            <div className="legend-row" key={index}>
              <span
                className="legend-dot"
                style={{ background: entry.color }}
              />
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