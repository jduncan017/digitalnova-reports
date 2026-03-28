"use client";

import { useRef, useEffect, useState } from "react";
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

/** Parse any CSS color string (hex or rgb()) into rgba with the given alpha. */
function toRgba(color: string, alpha: number): string {
  // Handle hex
  if (color.startsWith("#")) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  // Handle rgb(r, g, b) or rgba(r, g, b, a)
  const match = /(\d+),\s*(\d+),\s*(\d+)/.exec(color);
  if (match) {
    return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${alpha})`;
  }
  return color;
}

function useThemeColors(ref: React.RefObject<HTMLDivElement | null>) {
  const [colors, setColors] = useState<string[]>([]);
  const [tooltipBg, setTooltipBg] = useState("rgba(15, 17, 23, 0.95)");
  const [textColor, setTextColor] = useState("#e4e4e7");
  const [mutedColor, setMutedColor] = useState("#71717a");

  useEffect(() => {
    if (!ref.current) return;
    const styles = getComputedStyle(ref.current);
    const primary = styles.getPropertyValue("--primary").trim();
    const bg = styles.getPropertyValue("--bg").trim();

    if (primary) {
      setColors([
        toRgba(primary, 0.85),
        toRgba(primary, 0.65),
        toRgba(primary, 0.5),
        toRgba(primary, 0.4),
      ]);
    }
    if (bg) setTooltipBg(toRgba(bg, 0.95));
    setTextColor(
      styles.getPropertyValue("--text-heading").trim() || "#e4e4e7",
    );
    setMutedColor(
      styles.getPropertyValue("--text-muted").trim() || "#71717a",
    );
  }, [ref]);

  return { colors, tooltipBg, textColor, mutedColor };
}

export function BarChartCard({ chart }: { chart: ChartData }) {
  const ref = useRef<HTMLDivElement>(null);
  const { colors, tooltipBg, textColor, mutedColor } = useThemeColors(ref);

  const data = chart.data.labels.map((label, i) => ({
    name: label,
    value: chart.data.values[i],
  }));

  const fallback = [
    "rgba(29, 110, 227, 0.85)",
    "rgba(29, 110, 227, 0.65)",
    "rgba(29, 110, 227, 0.5)",
    "rgba(29, 110, 227, 0.4)",
  ];
  const barColors = colors.length > 0 ? colors : fallback;

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
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              fontSize: 14,
            }}
            itemStyle={{ color: "#fff" }}
            labelStyle={{
              color: "#fff",
              fontWeight: 600,
              marginBottom: 4,
            }}
            formatter={(value) => [Number(value).toLocaleString(), ""]}
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
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
