import { type Metric } from "~/lib/types";

export function MetricCard({ metric }: { metric: Metric }) {
  const noteColor =
    metric.status === "good"
      ? "#34d399"
      : metric.status === "bad"
        ? "#ef4444"
        : "var(--secondary)";

  return (
    <div
      className="rounded-2xl p-6 backdrop-blur-sm"
      style={{
        border: "1px solid var(--border)",
        backgroundColor: "var(--surface-transparent)",
      }}
    >
      <div
        className="mb-2 text-sm font-medium uppercase tracking-wider"
        style={{ color: "var(--text-muted)" }}
      >
        {metric.label}
      </div>
      <div
        className="text-3xl font-semibold tracking-tight"
        style={{ color: "var(--text-heading)" }}
      >
        {metric.value}
      </div>
      <div className="mt-1.5 text-sm" style={{ color: noteColor }}>
        {metric.note}
      </div>
    </div>
  );
}
