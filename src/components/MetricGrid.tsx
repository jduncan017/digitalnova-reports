import { type Metric } from "~/lib/types";
import { MetricCard } from "./MetricCard";

export function MetricGrid({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
      {metrics.map((m) => (
        <MetricCard key={m.label} metric={m} />
      ))}
    </div>
  );
}
