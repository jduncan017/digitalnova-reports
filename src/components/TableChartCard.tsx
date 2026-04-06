import { type ChartData } from "~/lib/types";

export function TableChartCard({ chart }: { chart: ChartData }) {
  const headers = chart.data.headers ?? [];
  const rows = chart.data.rows ?? [];

  return (
    <div
      className="card-shadow h-full rounded-2xl p-6 backdrop-blur-sm sm:p-7"
      style={{
        border: "1px solid var(--border)",
        backgroundColor: "var(--surface-transparent)",
      }}
    >
      <h3
        className="mb-4 text-base font-semibold"
        style={{ color: "var(--text-heading)" }}
      >
        {chart.title}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="border-b-2 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{
                    color: "var(--text-muted)",
                    borderColor: "var(--border)",
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const isLastRow = i === rows.length - 1;
              const isTotal =
                row[0]?.toUpperCase().includes("TOTAL") ?? false;

              return (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={`px-3 py-2 ${
                        isTotal ? "border-t-2" : ""
                      } ${!isLastRow && !isTotal ? "border-b" : ""}`}
                      style={{
                        color: isTotal
                          ? "var(--text-heading)"
                          : "var(--text-body)",
                        fontWeight: isTotal || j === 0 ? 600 : 400,
                        borderColor: "var(--border)",
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {chart.data.note && (
        <p
          className="mt-4 text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          {chart.data.note}
        </p>
      )}
    </div>
  );
}
