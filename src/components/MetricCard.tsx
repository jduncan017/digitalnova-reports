import { type Metric } from "~/lib/types";

export function MetricCard({ metric }: { metric: Metric }) {
  const noteColor =
    metric.status === "good"
      ? "#059669"
      : metric.status === "bad"
        ? "#ef4444"
        : "var(--primary)";

  return (
    <div
      className="card-shadow rounded-2xl p-6 backdrop-blur-sm"
      style={{
        border: "1px solid var(--border)",
        backgroundColor: "var(--surface-transparent)",
      }}
    >
      <div
        className="mb-2 text-xs font-medium uppercase tracking-wider"
        style={{ color: "var(--text-muted)" }}
      >
        {metric.label}
      </div>
      <div
        className="text-2xl font-semibold tracking-tight"
        style={{ color: "var(--text-heading)" }}
      >
        {metric.value}
      </div>
      <div className="mt-1.5 text-[15px]" style={{ color: noteColor }}>
        {metric.note}
      </div>
    </div>
  );
}
