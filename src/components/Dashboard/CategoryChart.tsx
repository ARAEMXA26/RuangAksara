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
  "#3b82f6", // blue
  "#f59e0b", // amber
  "#8b5cf6", // purple
  "#10b981", // emerald
  "#ef4444", // red
  "#06b6d4", // cyan
  "#ec4899", // pink
  "#f97316", // orange
];

export default function CategoryChart({ data }: CategoryChartProps) {
  return (
    <div className="admin-panel-card">
      <div className="admin-panel-header">
        <h3 className="admin-panel-title">Kategori Koleksi</h3>
      </div>
      <div className="category-chart-wrapper">
        <div className="category-chart-donut">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={78}
                paddingAngle={3}
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
          </ResponsiveContainer>
        </div>
        <div className="category-legend">
          {data.map((item, index) => (
            <div key={index} className="category-legend-item">
              <span
                className="category-legend-dot"
                style={{ background: COLORS[index % COLORS.length] }}
              />
              <span className="category-legend-label">{item.name}</span>
              <span className="category-legend-pct">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
