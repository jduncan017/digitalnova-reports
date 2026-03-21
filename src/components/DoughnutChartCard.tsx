"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { type ChartData } from "~/lib/types";

const COLORS = [
  "rgba(52, 211, 153, 0.8)",
  "rgba(251, 191, 36, 0.8)",
  "rgba(63, 63, 94, 0.6)",
];

export function DoughnutChartCard({ chart }: { chart: ChartData }) {
  const data = chart.data.labels.map((label, i) => ({
    name: label,
    value: chart.data.values[i],
  }));

  return (
    <div
      className="rounded-2xl p-6 backdrop-blur-sm sm:p-7"
      style={{
        border: "1px solid var(--border)",
        backgroundColor: "var(--surface-transparent)",
      }}
    >
      <h3
        className="mb-4 text-base font-semibold"
        style={{ color: "var(--text-heading)" }}
      >
        {chart.title}
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            dataKey="value"
            stroke="none"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(15, 17, 23, 0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              fontSize: 14,
            }}
            itemStyle={{ color: "#fff" }}
            labelStyle={{ color: "#fff" }}
            formatter={(value, name) => [
              `${String(value)}%`,
              String(name),
            ]}
          />
          <Legend
            verticalAlign="bottom"
            formatter={(value: string) => (
              <span style={{ color: "var(--text-body)", fontSize: 13 }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
