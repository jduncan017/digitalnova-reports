"use client";

import { type Funnel } from "~/lib/types";

const CHART_HEIGHT = 200;
const RAMP_WIDTH = 28;

export function FunnelChart({ funnel }: { funnel: Funnel }) {
  const maxCount = funnel.steps[0]?.count ?? 1;

  // Pre-calculate heights
  const heights = funnel.steps.map(
    (step) => Math.max((step.count / maxCount) * CHART_HEIGHT, 16),
  );

  // Build the items: bar, ramp, bar, ramp, bar...
  const items: React.ReactNode[] = [];
  funnel.steps.forEach((step, i) => {
    const h = heights[i]!;

    // Bar
    items.push(
      <div
        key={`bar-${step.label}`}
        className="flex flex-1 items-end"
        style={{ height: CHART_HEIGHT }}
      >
        <div
          className="w-full rounded-t-md"
          style={{
            height: h,
            background:
              "linear-gradient(180deg, var(--primary), var(--secondary))",
          }}
        />
      </div>,
    );

    // Ramp between this bar and the next
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

  return (
    <div
      className="mb-12 rounded-2xl p-6 backdrop-blur-sm sm:p-8"
      style={{
        border: "1px solid var(--border)",
        backgroundColor: "var(--surface-transparent)",
      }}
    >
      {/* Bars + ramps */}
      <div className="flex items-end">{items}</div>

      {/* Labels row — needs to align with bars, skipping ramp space */}
      <div className="mt-4 flex">
        {funnel.steps.map((step, i) => (
          <div
            key={step.label}
            className="flex-1 text-center"
            style={{
              // Add margin-right equal to ramp width to stay aligned with bars
              marginRight:
                i < funnel.steps.length - 1 ? RAMP_WIDTH : 0,
            }}
          >
            <div
              className="text-2xl font-bold"
              style={{ color: "var(--text-heading)" }}
            >
              {step.count.toLocaleString()}
            </div>
            <div
              className="mt-0.5 text-sm font-medium"
              style={{ color: "var(--text-body)" }}
            >
              {step.label}
            </div>
            <div
              className="mt-0.5 text-sm font-semibold"
              style={{
                color:
                  step.pct >= 50
                    ? "#34d399"
                    : step.pct >= 15
                      ? "var(--secondary)"
                      : "#fbbf24",
              }}
            >
              {step.pct}%
            </div>
          </div>
        ))}
      </div>

      <p
        className="mt-6 text-center text-sm"
        style={{ color: "var(--text-muted)" }}
      >
        {funnel.notes}
      </p>
    </div>
  );
}
