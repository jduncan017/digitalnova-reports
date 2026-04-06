"use client";

import { type Funnel, type FunnelStep } from "~/lib/types";

const CHART_HEIGHT = 200;
const RAMP_WIDTH = 28;
const MIN_HEIGHT = 24;

function SingleFunnel({
  steps,
  label,
}: {
  steps: FunnelStep[];
  label?: string;
}) {
  const numericSteps = steps.filter(
    (s): s is FunnelStep & { count: number } => typeof s.count === "number",
  );
  const maxCount = numericSteps[0]?.count ?? 1;
  const logMax = Math.log(maxCount + 1);

  const heights = steps.map((step) => {
    if (typeof step.count !== "number" || step.count === 0) return MIN_HEIGHT;
    const logVal = Math.log(step.count + 1);
    return Math.max((logVal / logMax) * CHART_HEIGHT, MIN_HEIGHT);
  });

  // Build desktop items: bar, ramp, bar, ramp, bar...
  const items: React.ReactNode[] = [];
  steps.forEach((step, i) => {
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

    if (i < steps.length - 1) {
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

  const maxW = 100;

  return (
    <div>
      {label && (
        <h4
          className="mb-4 text-sm font-semibold uppercase tracking-wider"
          style={{ color: "var(--primary)" }}
        >
          {label}
        </h4>
      )}

      {/* Desktop: horizontal bar chart with ramps */}
      <div className="hidden items-end sm:flex">{items}</div>

      {/* Desktop: labels row */}
      <div className="mt-5 hidden sm:flex">
        {steps.map((step, i) => (
          <div
            key={step.label}
            className="flex-1 text-center"
            style={{
              marginRight: i < steps.length - 1 ? RAMP_WIDTH : 0,
            }}
          >
            <div
              className="text-2xl font-bold lg:text-3xl"
              style={{ color: "var(--text-heading)" }}
            >
              {typeof step.count === "number"
                ? step.count.toLocaleString()
                : step.count}
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
              {typeof step.pct === "number" ? `${step.pct}%` : step.pct}
            </div>
            {step.note && (
              <div
                className="mt-0.5 text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                {step.note}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile: vertical list with horizontal bars */}
      <div className="space-y-3 sm:hidden">
        {steps.map((step) => {
          const numCount = typeof step.count === "number" ? step.count : 0;
          const pct = maxCount > 0 ? (numCount / maxCount) * maxW : 0;
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
                  {typeof step.pct === "number" ? `${step.pct}%` : step.pct}
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
                  {typeof step.count === "number"
                    ? step.count.toLocaleString()
                    : step.count}
                </span>
              </div>
              {step.note && (
                <div
                  className="mt-1 text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  {step.note}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function FunnelChart({ funnel }: { funnel: Funnel }) {
  const hasPaths = funnel.paths && funnel.paths.length > 0;

  return (
    <div
      className="card-shadow mb-12 rounded-2xl p-4 backdrop-blur-sm sm:p-8"
      style={{
        border: "1px solid var(--border)",
        backgroundColor: "var(--surface-transparent)",
      }}
    >
      {hasPaths ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {funnel.paths!.map((path) => (
            <SingleFunnel
              key={path.name}
              steps={path.steps}
              label={path.name}
            />
          ))}
        </div>
      ) : funnel.steps ? (
        <SingleFunnel steps={funnel.steps} />
      ) : null}

      {funnel.notes && (
        <p
          className="mt-6 text-center text-sm sm:text-[15px]"
          style={{ color: "var(--text-muted)" }}
        >
          {funnel.notes}
        </p>
      )}
    </div>
  );
}
