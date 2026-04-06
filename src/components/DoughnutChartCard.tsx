"use client";

import { type ChartData } from "~/lib/types";

export function DoughnutChartCard({ chart }: { chart: ChartData }) {
  const data = (chart.data.labels ?? [])
    .map((label, i) => ({
      name: label,
      value: (chart.data.values ?? [])[i] ?? 0,
    }))
    .sort((a, b) => b.value - a.value);

  const maxVal = data[0]?.value ?? 1;

  return (
    <div
      className="card-shadow h-full rounded-2xl p-6 backdrop-blur-sm sm:p-7"
      style={{
        border: "1px solid var(--border)",
        backgroundColor: "var(--surface-transparent)",
      }}
    >
      <h3
        className="mb-5 text-base font-semibold"
        style={{ color: "var(--text-heading)" }}
      >
        {chart.title}
      </h3>
      <div className="space-y-3">
        {data.map((item, i) => (
          <div key={item.name}>
            <div
              className="mb-1 text-[13px]"
              style={{ color: "var(--text-body)" }}
            >
              {item.name}
            </div>
            <div className="flex items-center gap-2">
              <div
                className="h-7 rounded-md"
                style={{
                  width: `${Math.max((item.value / maxVal) * 100, 3)}%`,
                  backgroundColor: "var(--primary)",
                  opacity: Math.max(0.35, 1 - i * 0.12),
                }}
              />
              <span
                className="shrink-0 text-[13px] font-medium"
                style={{ color: "var(--text-body)" }}
              >
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
