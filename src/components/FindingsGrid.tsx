import {
  Target,
  Search,
  TrendingUp,
  Zap,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";
import { type Finding } from "~/lib/types";

const iconMap: Record<string, LucideIcon> = {
  target: Target,
  search: Search,
  "trending-up": TrendingUp,
  zap: Zap,
  "bar-chart": BarChart3,
  check: CheckCircle,
  warning: AlertTriangle,
};

function FindingCard({ finding }: { finding: Finding }) {
  const Icon = iconMap[finding.icon] ?? Zap;

  return (
    <div
      className="rounded-2xl p-6 backdrop-blur-sm"
      style={
        finding.highlight
          ? {
              border:
                "1px solid color-mix(in srgb, var(--secondary) 30%, transparent)",
              background:
                "linear-gradient(135deg, var(--surface-transparent), color-mix(in srgb, var(--primary) 10%, transparent))",
            }
          : {
              border: "1px solid var(--border)",
              backgroundColor: "var(--surface-transparent)",
            }
      }
    >
      <div
        className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--primary) 15%, transparent)",
        }}
      >
        <Icon className="h-5 w-5" style={{ color: "var(--secondary)" }} />
      </div>
      <h4
        className="mb-2 text-base font-semibold"
        style={{ color: "var(--text-heading)" }}
      >
        {finding.title}
      </h4>
      <p
        className="text-[15px] leading-relaxed"
        style={{ color: "var(--text-body)" }}
      >
        {finding.description}
      </p>
    </div>
  );
}

export function FindingsGrid({ findings }: { findings: Finding[] }) {
  return (
    <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {findings.map((f) => (
        <FindingCard key={f.title} finding={f} />
      ))}
    </div>
  );
}
