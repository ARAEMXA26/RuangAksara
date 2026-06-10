"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface BorrowChartProps {
  data: { month: string; count: number }[];
}

export default function BorrowChart({ data }: BorrowChartProps) {
  // Ensure data always has baseline values (minimum 0.2 so line is visible even with no data)
  const chartData = data.map((d) => ({
    ...d,
    count: d.count,
    display: Math.max(d.count, 0.2), // baseline so line always shows
  }));

  // Calculate max for Y-axis domain (minimum 5 so chart doesn't look flat)
  const maxCount = Math.max(...data.map((d) => d.count), 5);

  return (
    <div className="admin-panel-card">
      <div className="admin-panel-header" style={{ flexWrap: "nowrap", gap: 12 }}>
        <h3 className="admin-panel-title" style={{ whiteSpace: "nowrap" }}>Aktivitas Peminjaman</h3>
        <span className="admin-panel-badge" style={{ whiteSpace: "nowrap" }}>6 Bulan Terakhir</span>
      </div>
      <div style={{ width: "100%", height: 240 }}>
        <ResponsiveContainer>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="borrowGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1e293b" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#1e293b" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              domain={[0, maxCount]}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: "#1e293b",
                border: "none",
                borderRadius: "10px",
                color: "#fff",
                fontSize: "0.85rem",
                padding: "10px 16px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              }}
              labelStyle={{ color: "#94a3b8", marginBottom: 4, fontWeight: 600 }}
              formatter={(value: number, name: string, props: any) => {
                const realValue = props.payload.count;
                return [`${realValue} peminjaman`, ""];
              }}
              cursor={{ stroke: "#1e293b", strokeWidth: 1, strokeDasharray: "4 4" }}
            />
            <Area
              type="monotone"
              dataKey="display"
              stroke="#1e293b"
              strokeWidth={2.5}
              fill="url(#borrowGradient)"
              dot={{ r: 5, fill: "#1e293b", stroke: "#fff", strokeWidth: 2.5 }}
              activeDot={{ r: 7, fill: "#1e293b", stroke: "#fff", strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
