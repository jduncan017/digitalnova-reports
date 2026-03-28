"use client";

import { type Funnel } from "~/lib/types";

const CHART_HEIGHT = 200;
const RAMP_WIDTH = 28;

export function FunnelChart({ funnel }: { funnel: Funnel }) {
  const maxCount = funnel.steps[0]?.count ?? 1;
  const MIN_HEIGHT = 24;

  // Logarithmic scale so small values are still visually distinct
  const logMax = Math.log(maxCount + 1);
  const heights = funnel.steps.map((step) => {
    if (step.count === 0) return MIN_HEIGHT;
    const logVal = Math.log(step.count + 1);
    return Math.max((logVal / logMax) * CHART_HEIGHT, MIN_HEIGHT);
  });

  // Build the items: bar, ramp, bar, ramp, bar...
  const items: React.ReactNode[] = [];
  funnel.steps.forEach((step, i) => {
    const h = heights[i]!;

    items.push(
      <div
        key={`bar-${step.label}`}
        className="flex flex-1 items-end"
        style={{ height: CHART_HEIGHT }}
      >
        <div
          className="w-full rounded-t-md"
          style={{ height: h, background: "var(--primary)" }}
        />
      </div>,
    );

    if (i < funnel.steps.length - 1) {
      const nextH = heights[i + 1]!;
      const topLeft = CHART_HEIGHT - h;
      const topRight = CHART_HEIGHT - nextH;

      items.push(
        <svg
          key={`ramp-${step.label}`}
          width={RAMP_WIDTH}
          height={CHART_HEIGHT}
          className="shrink-0"
          preserveAspectRatio="none"
        >
          <polygon
            points={`0,${topLeft} ${RAMP_WIDTH},${topRight} ${RAMP_WIDTH},${CHART_HEIGHT} 0,${CHART_HEIGHT}`}
            style={{
              fill: "color-mix(in srgb, var(--primary) 20%, transparent)",
            }}
          />
        </svg>,
      );
    }
  });

  // Max width for mobile horizontal bars
  const maxW = 100;

  return (
    <div
      className="card-shadow mb-12 rounded-2xl p-4 backdrop-blur-sm sm:p-8"
      style={{
        border: "1px solid var(--border)",
        backgroundColor: "var(--surface-transparent)",
      }}
    >
      {/* Desktop: horizontal bar chart with ramps */}
      <div className="hidden items-end sm:flex">{items}</div>

      {/* Desktop: labels row */}
      <div className="mt-5 hidden sm:flex">
        {funnel.steps.map((step, i) => (
          <div
            key={step.label}
            className="flex-1 text-center"
            style={{
              marginRight: i < funnel.steps.length - 1 ? RAMP_WIDTH : 0,
            }}
          >
            <div
              className="text-2xl font-bold lg:text-3xl"
              style={{ color: "var(--text-heading)" }}
            >
              {step.count.toLocaleString()}
            </div>
            <div
              className="mt-0.5 text-sm font-medium lg:text-[15px]"
              style={{ color: "var(--text-body)" }}
            >
              {step.label}
            </div>
            <div
              className="mt-0.5 text-sm font-semibold lg:text-[15px]"
              style={{ color: "var(--primary)" }}
            >
              {step.pct}%
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: vertical list with horizontal bars */}
      <div className="space-y-3 sm:hidden">
        {funnel.steps.map((step) => {
          const pct = maxCount > 0 ? (step.count / maxCount) * maxW : 0;
          const barW = Math.max(pct, 8);

          return (
            <div key={step.label}>
              <div className="mb-1 flex items-baseline justify-between">
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--text-body)" }}
                >
                  {step.label}
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--primary)" }}
                >
                  {step.pct}%
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="h-6 rounded-md"
                  style={{
                    width: `${barW}%`,
                    background: "var(--primary)",
                  }}
                />
                <span
                  className="shrink-0 text-lg font-bold"
                  style={{ color: "var(--text-heading)" }}
                >
                  {step.count.toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <p
        className="mt-6 text-center text-sm sm:text-[15px]"
        style={{ color: "var(--text-muted)" }}
      >
        {funnel.notes}
      </p>
    </div>
  );
}
