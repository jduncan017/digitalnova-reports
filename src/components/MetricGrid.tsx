import { type Metric } from "~/lib/types";
import { MetricCard } from "./MetricCard";

const smColsClass: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
};

export function MetricGrid({ metrics }: { metrics: Metric[] }) {
  const cols = Math.min(metrics.length, 4);
  return (
    <div className={`mb-10 grid grid-cols-2 gap-4 ${smColsClass[cols]}`}>
      {metrics.map((m) => (
        <MetricCard key={m.label} metric={m} />
      ))}
    </div>
  );
}
