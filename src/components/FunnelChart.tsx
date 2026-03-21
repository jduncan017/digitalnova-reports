"use client";

import { type Funnel } from "~/lib/types";

const CHART_HEIGHT = 200;
const RAMP_WIDTH = 28;


export function FunnelChart({
  funnel,
  adSpend,
}: {
  funnel: Funnel;
  adSpend?: number;
}) {
  const maxCount = funnel.steps[0]?.count ?? 1;

  // Pre-calculate heights
  const heights = funnel.steps.map(
    (step) => Math.max((step.count / maxCount) * CHART_HEIGHT, 16),
  );

  // Build cost-per metrics if ad spend is provided
  const costPer = adSpend
    ? funnel.steps.map((step) =>
        step.count > 0 ? (adSpend / step.count).toFixed(2) : null,
      )
    : null;

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
            background: "var(--primary)",
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
      className="card-shadow mb-12 rounded-2xl p-6 backdrop-blur-sm sm:p-8"
      style={{
        border: "1px solid var(--border)",
        backgroundColor: "var(--surface-transparent)",
      }}
    >
      {/* Bars + ramps */}
      <div className="flex items-end">{items}</div>

      {/* Labels row */}
      <div className="mt-5 flex">
        {funnel.steps.map((step, i) => (
          <div
            key={step.label}
            className="flex-1 text-center"
            style={{
              marginRight:
                i < funnel.steps.length - 1 ? RAMP_WIDTH : 0,
            }}
          >
            <div
              className="text-3xl font-bold"
              style={{ color: "var(--text-heading)" }}
            >
              {step.count.toLocaleString()}
            </div>
            <div
              className="mt-0.5 text-[15px] font-medium"
              style={{ color: "var(--text-body)" }}
            >
              {step.label}
            </div>
            <div
              className="mt-0.5 text-[15px] font-semibold"
              style={{ color: "var(--primary)" }}
            >
              {step.pct}%
            </div>
            {costPer?.[i] && (
              <div
                className="mt-1 text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                ${costPer[i]}/user
              </div>
            )}
          </div>
        ))}
      </div>

      <p
        className="mt-6 text-center text-[15px]"
        style={{ color: "var(--text-muted)" }}
      >
        {funnel.notes}
      </p>
    </div>
  );
}
