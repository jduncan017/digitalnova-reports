"use client";

import { useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { type ChartData } from "~/lib/types";
import { useThemeColors, toRgba } from "~/hooks/useThemeColors";

export function BarChartCard({ chart }: { chart: ChartData }) {
  const ref = useRef<HTMLDivElement>(null);
  const { primary, tooltipBg, textColor, mutedColor, borderColor, cursorFill } =
    useThemeColors(ref);

  const values = chart.data.values ?? [];
  const data = (chart.data.labels ?? []).map((label, i) => ({
    name: label,
    value: values[i] ?? 0,
  }));

  const barColors = [
    toRgba(primary, 0.85),
    toRgba(primary, 0.65),
    toRgba(primary, 0.5),
    toRgba(primary, 0.4),
  ];

  return (
    <div
      ref={ref}
      className="card-shadow h-full rounded-2xl p-6 backdrop-blur-sm sm:p-7"
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
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            tick={{ fill: textColor, fontSize: 13 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: mutedColor, fontSize: 13 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              border: `1px solid ${borderColor}`,
              borderRadius: 10,
              fontSize: 14,
            }}
            itemStyle={{ color: textColor }}
            labelStyle={{
              color: textColor,
              fontWeight: 600,
              marginBottom: 4,
            }}
            formatter={(value) => [Number(value).toLocaleString(), ""]}
            cursor={{ fill: cursorFill }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={barColors[i % barColors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
