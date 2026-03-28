"use client";

import { useRef, useEffect, useState, type RefObject } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
type ChartFormat = "number" | "dollar" | "dollar2" | "percent";

type ChartConfig = {
  key: string;
  title: string;
  subtitle?: string;
  format: ChartFormat;
};

type TrendPoint = Record<string, number | string | null>;

const formatters: Record<ChartFormat, (v: number) => string> = {
  number: (v) => v.toLocaleString(),
  dollar: (v) => `$${v.toLocaleString()}`,
  dollar2: (v) => `$${v.toFixed(2)}`,
  percent: (v) => `${v.toFixed(1)}%`,
};

function useThemeColors(ref: RefObject<HTMLDivElement | null>) {
  const [primary, setPrimary] = useState("#1d6ee3");
  const [tooltipBg, setTooltipBg] = useState("rgba(15, 17, 23, 0.95)");
  const [textColor, setTextColor] = useState("#e4e4e7");
  const [mutedColor, setMutedColor] = useState("#71717a");
  const [borderColor, setBorderColor] = useState("rgba(255,255,255,0.1)");

  useEffect(() => {
    if (!ref.current) return;
    const styles = getComputedStyle(ref.current);
    const p = styles.getPropertyValue("--primary").trim();
    const bg = styles.getPropertyValue("--bg").trim();
    const border = styles.getPropertyValue("--border").trim();
    if (p) setPrimary(p);
    if (bg) setTooltipBg(bg);
    if (border) setBorderColor(border);
    setTextColor(styles.getPropertyValue("--text-heading").trim() || "#e4e4e7");
    setMutedColor(styles.getPropertyValue("--text-muted").trim() || "#71717a");
  }, [ref]);

  return { primary, tooltipBg, textColor, mutedColor, borderColor };
}

function TrendCard({
  config,
  data,
  primary,
  tooltipBg,
  textColor,
  mutedColor,
  borderColor,
}: {
  config: ChartConfig;
  data: TrendPoint[];
  primary: string;
  tooltipBg: string;
  textColor: string;
  mutedColor: string;
  borderColor: string;
}) {
  const fmt = formatters[config.format];
  const current = data[data.length - 1]!;
  const currentVal = (current[config.key] as number | null) ?? 0;

  // Find last two non-null values for % change
  const nonNullValues = data
    .map((d) => d[config.key] as number | null)
    .filter((v): v is number => v !== null && v !== 0);
  const prevVal =
    nonNullValues.length >= 2
      ? nonNullValues[nonNullValues.length - 2]
      : undefined;

  let changeText = "";
  if (prevVal !== undefined && prevVal !== 0 && currentVal !== 0) {
    const pctChange = ((currentVal - prevVal) / prevVal) * 100;
    const sign = pctChange >= 0 ? "+" : "";
    changeText = `${sign}${pctChange.toFixed(0)}% from last week`;
  }

  return (
    <div
      className="card-shadow rounded-2xl p-5 backdrop-blur-sm sm:p-6"
      style={{
        border: "1px solid var(--border)",
        backgroundColor: "var(--surface-transparent)",
      }}
    >
      <div className="mb-1 flex items-baseline justify-between">
        <span
          className="text-xs font-medium tracking-wider uppercase"
          style={{ color: mutedColor }}
        >
          {config.title}
        </span>
        {changeText && (
          <span className="text-xs" style={{ color: mutedColor }}>
            {changeText}
          </span>
        )}
      </div>
      <div className="mb-1 text-xl font-semibold" style={{ color: textColor }}>
        {currentVal === 0 && nonNullValues.length === 0 ? "—" : fmt(currentVal)}
      </div>
      {config.subtitle && (
        <div className="mb-3 text-xs" style={{ color: mutedColor }}>
          {config.subtitle}
        </div>
      )}
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={data}>
          <defs>
            <linearGradient
              id={`grad-${config.key}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={primary} stopOpacity={0.25} />
              <stop offset="100%" stopColor={primary} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="label"
            tick={{ fill: mutedColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide domain={["auto", "auto"]} />
          <Tooltip
            trigger="hover"
            active={undefined}
            contentStyle={{
              backgroundColor: tooltipBg,
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: `1px solid ${borderColor}`,
              borderRadius: 10,
              fontSize: 13,
            }}
            itemStyle={{ color: textColor }}
            labelStyle={{ color: textColor, fontWeight: 600, marginBottom: 4 }}
            formatter={(value) => {
              if (value === null || value === undefined)
                return ["—", config.title];
              return [fmt(Number(value)), config.title];
            }}
          />
          <Area
            type="monotone"
            dataKey={config.key}
            stroke={primary}
            strokeWidth={2}
            fill={`url(#grad-${config.key})`}
            dot={{ fill: primary, r: 3, strokeWidth: 0 }}
            activeDot={{ r: 3, fill: primary, strokeWidth: 0 }}
            isAnimationActive={false}
            connectNulls
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TrendCharts({
  data,
  charts,
}: {
  data: TrendPoint[];
  charts: ChartConfig[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { primary, tooltipBg, textColor, mutedColor, borderColor } =
    useThemeColors(ref);

  if (data.length < 2) return null;

  return (
    <div ref={ref} className="mb-10">
      <h2
        className="mb-4 text-xl font-semibold"
        style={{ color: "var(--text-heading)" }}
      >
        Performance Trends
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {charts.map((config) => (
          <TrendCard
            key={config.key}
            config={config}
            data={data}
            primary={primary}
            tooltipBg={tooltipBg}
            textColor={textColor}
            borderColor={borderColor}
            mutedColor={mutedColor}
          />
        ))}
      </div>
    </div>
  );
}
