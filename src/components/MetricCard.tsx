import { type Metric } from "~/lib/types";

export function MetricCard({ metric }: { metric: Metric }) {
  const noteColor =
    metric.status === "good"
      ? "#059669"
      : metric.status === "bad"
        ? "#ef4444"
        : metric.status === "warning"
          ? "#f59e0b"
          : "var(--primary)";

  return (
    <div
      className="card-shadow rounded-2xl p-4 backdrop-blur-sm sm:p-6"
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
        className="text-xl font-semibold tracking-tight sm:text-2xl"
        style={{ color: "var(--text-heading)" }}
      >
        {metric.value}
      </div>
      <div className="mt-1.5 text-sm sm:text-[15px]" style={{ color: noteColor }}>
        {metric.note}
      </div>
    </div>
  );
}
