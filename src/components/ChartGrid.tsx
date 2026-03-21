import { type ChartData } from "~/lib/types";
import { BarChartCard } from "./BarChartCard";
import { DoughnutChartCard } from "./DoughnutChartCard";

export function ChartGrid({ charts }: { charts: ChartData[] }) {
  return (
    <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
      {charts.map((chart) => {
        if (chart.type === "bar") {
          return <BarChartCard key={chart.id} chart={chart} />;
        }
        if (chart.type === "doughnut") {
          return <DoughnutChartCard key={chart.id} chart={chart} />;
        }
        return null;
      })}
    </div>
  );
}
