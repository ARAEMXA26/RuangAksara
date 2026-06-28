"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface CategoryItem {
  name: string;
  value: number;
  percentage: number;
}

interface CategoryChartProps {
  data: CategoryItem[];
}

const COLORS = [
  "#020617", // slate-950 (hampir hitam pekat)
  "#1e293b", // slate-800
  "#334155", // slate-700
  "#475569", // slate-600
  "#64748b", // slate-500
  "#94a3b8", // slate-400
  "#cbd5e1", // slate-300
  "#e2e8f0", // slate-200
];

export default function CategoryChart({ data }: CategoryChartProps) {
  return (
    <div className="admin-panel-card">
      <div className="admin-panel-header">
        <h3 className="admin-panel-title">Kategori Koleksi</h3>
      </div>
      <div className="category-chart-wrapper">
        <div className="category-chart-donut">
          <PieChart width={140} height={140}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={65}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#1e293b",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "0.85rem",
                padding: "8px 14px",
              }}
              formatter={(value: number, name: string) => [`${value} buku`, name]}
            />
          </PieChart>
        </div>
        <div className="category-legend">
          {data.map((item, index) => (
            <div key={index} className="category-legend-item">
              <div className="category-legend-left">
                <span
                  className="category-legend-dot"
                  style={{ background: COLORS[index % COLORS.length] }}
                />
                <span className="category-legend-label" title={item.name}>{item.name}</span>
              </div>
              <span className="category-legend-pct">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
