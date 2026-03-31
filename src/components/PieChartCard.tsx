"use client";

import { useRef } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { type ChartData } from "~/lib/types";
import { useThemeColors } from "~/hooks/useThemeColors";

const PALETTE = [
  "#60a5fa", // blue
  "#34d399", // emerald
  "#fbbf24", // amber
  "#f472b6", // pink
  "#a78bfa", // violet
  "#fb923c", // orange
  "#2dd4bf", // teal
  "#e879f9", // fuchsia
  "#94a3b8", // slate
  "#f87171", // red
];

export function PieChartCard({ chart }: { chart: ChartData }) {
  const ref = useRef<HTMLDivElement>(null);
  const { tooltipBg, textColor, borderColor } = useThemeColors(ref);

  const data = chart.data.labels.map((label, i) => ({
    name: label,
    value: chart.data.values[i] ?? 0,
  }));

  return (
    <div
      ref={ref}
      className="card-shadow flex h-full flex-col rounded-2xl p-6 backdrop-blur-sm sm:p-7"
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
      <div className="flex flex-1 items-center justify-center">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius={95}
              dataKey="value"
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${borderColor}`,
                borderRadius: 10,
                fontSize: 13,
              }}
              itemStyle={{ color: textColor }}
              labelStyle={{ color: textColor }}
              formatter={(value, name) => [String(value), String(name)]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
        {data.map((item, i) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
            />
            <span
              className="text-[13px]"
              style={{ color: "var(--text-body)" }}
            >
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
