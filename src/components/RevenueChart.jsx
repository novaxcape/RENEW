import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer
} from "recharts";

const data = [
  { day: "1st",  revenue: 90000 },
  { day: "2nd",  revenue: 65000 },
  { day: "3rd",  revenue: 100000 },
  { day: "4th",  revenue: 97000 },
  { day: "5th",  revenue: 72000 },
  { day: "6th",  revenue: 75000 },
  { day: "7th",  revenue: 100000 },
  { day: "8th",  revenue: 68000 },
  { day: "9th",  revenue: 97000 },
  { day: "10th", revenue: 63000 },
  { day: "11th", revenue: 78000 },
  { day: "12th", revenue: 72000 },
  { day: "13th", revenue: 75000 },
  { day: "14th", revenue: 72000 },
];

const RevenueChart = () => {
  return (
    <div className="chart-card">
      <h3 className="chart-title">Visitor Revenue Trend</h3>
      <p className="chart-subtitle">For May 7th - May 14th</p>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 20, right: 20, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#C5EBE9" stopOpacity={1} />
              <stop offset="100%" stopColor="#F7FCFC" stopOpacity={0.3} />
            </linearGradient>
          </defs>

          <CartesianGrid
            vertical={true}
            horizontal={true}
            stroke="#e2e8f0"
            strokeDasharray=""
          />

          <XAxis
            dataKey="day"
            tick={{ fontSize: 12, fill: "#64748b", fontFamily: "Manrope" }}
            axisLine={false}
            tickLine={{ stroke: "#94a3b8", strokeWidth: 1.5 }}
            tickSize={6}
          />

          <YAxis
            tick={{ fontSize: 12, fill: "#64748b", fontFamily: "Manrope" }}
            axisLine={false}
            tickLine={{ stroke: "#94a3b8", strokeWidth: 1.5 }}
            tickSize={6}
            domain={[0, 120000]}
            ticks={[0, 30000, 60000, 90000, 120000]}
            tickFormatter={(v) => v.toLocaleString()}
          />

          <Tooltip
            formatter={(value) => [`₦${value.toLocaleString()}`, "Revenue"]}
            contentStyle={{
              borderRadius: 10,
              border: "1px solid #e2e8f0",
              fontFamily: "Manrope"
            }}
          />

          <Area
            type="linear"
            dataKey="revenue"
            stroke="none"
            strokeWidth={0}
            fill="url(#revenueGradient)"
            dot={{
              r: 5,
              fill: "#01388C",
              stroke: "#01388C",
              strokeWidth: 0
            }}
            activeDot={{
              r: 6,
              fill: "#01388C",
              stroke: "#01388C"
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;