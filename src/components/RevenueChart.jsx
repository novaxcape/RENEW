import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
// import "./css/RevenueChart.css";
const data = [
  { day: "1st", revenue: 62000 },
  { day: "2nd", revenue: 104000 },
  { day: "3rd", revenue: 92000 },
  { day: "4th", revenue: 103000 },
  { day: "5th", revenue: 72000 },
  { day: "6th", revenue: 76000 },
  { day: "7th", revenue: 97000 },
  { day: "8th", revenue: 68000 },
  { day: "9th", revenue: 96000 },
  { day: "10th", revenue: 62000 },
  { day: "11th", revenue: 79000 },
  { day: "12th", revenue: 70000 },
  { day: "13th", revenue: 76000 },
  { day: "14th", revenue: 71000 },
];

const RevenueChart = () => {
  return (
    <div className="chart-card">

      <h3>Visitor Revenue Trend</h3>

      <p>For May 7th - May 14th</p>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <AreaChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />

          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#0d47a1"
            fill="#d8edf8"
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>

    </div>
  );
};

export default RevenueChart;