import { type Finding } from "~/lib/types";

function FindingCard({ finding, index }: { finding: Finding; index: number }) {
  return (
    <div
      className="card-shadow rounded-2xl p-4 backdrop-blur-sm sm:p-6"
      style={{
        border: "1px solid var(--border)",
        backgroundColor: "var(--surface-transparent)",
      }}
    >
      <div className="mb-3 flex items-baseline gap-2">
        <span
          className="text-xl font-bold"
          style={{ color: "var(--primary)" }}
        >
          {index + 1})
        </span>
        <h4
          className="text-base font-semibold sm:text-lg"
          style={{ color: "var(--text-heading)" }}
        >
          {finding.title}
        </h4>
      </div>
      <p
        className="text-[15px] leading-relaxed"
        style={{ color: "var(--text-muted)" }}
      >
        {finding.description}
      </p>
    </div>
  );
}

export function FindingsGrid({ findings }: { findings: Finding[] }) {
  return (
    <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {findings.map((f, i) => (
        <FindingCard key={f.title} finding={f} index={i} />
      ))}
    </div>
  );
}
