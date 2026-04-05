import { type ChartData } from "~/lib/types";
import { BarChartCard } from "./BarChartCard";
import { DoughnutChartCard } from "./DoughnutChartCard";
import { PieChartCard } from "./PieChartCard";

function ChartComponent({ chart }: { chart: ChartData }) {
  if (chart.type === "bar") return <BarChartCard chart={chart} />;
  if (chart.type === "horizontal-bar" || chart.type === "doughnut")
    return <DoughnutChartCard chart={chart} />;
  if (chart.type === "pie") return <PieChartCard chart={chart} />;
  return null;
}

export function ChartGrid({ charts }: { charts: ChartData[] }) {
  const renderable = charts.filter(
    (c) => c.type === "bar" || c.type === "horizontal-bar" || c.type === "doughnut" || c.type === "pie",
  );

  return (
    <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
      {renderable.map((chart) => (
        <div
          key={chart.id}
          className={
            chart.width === "full"
              ? "col-span-1 sm:col-span-2"
              : "col-span-1"
          }
        >
          <ChartComponent chart={chart} />
        </div>
      ))}
    </div>
  );
}
