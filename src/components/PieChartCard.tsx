"use client";

import { useRef, useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { type ChartData } from "~/lib/types";

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

function useThemeColors(ref: React.RefObject<HTMLDivElement | null>) {
  const [bg, setBg] = useState("rgba(15, 17, 23, 0.95)");
  const [text, setText] = useState("#e4e4e7");
  const [border, setBorder] = useState("rgba(255,255,255,0.1)");

  useEffect(() => {
    if (!ref.current) return;
    const s = getComputedStyle(ref.current);
    const bgVal = s.getPropertyValue("--bg").trim();
    const borderVal = s.getPropertyValue("--border").trim();
    const textVal = s.getPropertyValue("--text-heading").trim();
    if (bgVal) setBg(bgVal);
    if (borderVal) setBorder(borderVal);
    if (textVal) setText(textVal);
  }, [ref]);

  return { bg, text, border };
}

export function PieChartCard({ chart }: { chart: ChartData }) {
  const ref = useRef<HTMLDivElement>(null);
  const { bg, text, border } = useThemeColors(ref);

  const data = chart.data.labels.map((label, i) => ({
    name: label,
    value: chart.data.values[i] ?? 0,
  }));

  return (
    <div
      ref={ref}
      className="card-shadow flex flex-col rounded-2xl p-6 backdrop-blur-sm sm:p-7"
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
                backgroundColor: bg,
                border: `1px solid ${border}`,
                borderRadius: 10,
                fontSize: 13,
              }}
              itemStyle={{ color: text }}
              labelStyle={{ color: text }}
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
