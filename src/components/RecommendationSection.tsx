import { type Recommendation } from "~/lib/types";

export function RecommendationSection({
  recommendation,
}: {
  recommendation: Recommendation;
}) {
  return (
    <div className="mb-12 space-y-6">
      <p
        className="max-w-[720px] text-base leading-relaxed"
        style={{ color: "var(--text-body)" }}
      >
        {recommendation.context}
      </p>

      {/* Proposed changes */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {recommendation.changes.map((change, i) => (
          <div
            key={change.title}
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
                {i + 1})
              </span>
              <h4
                className="text-base font-semibold sm:text-lg"
                style={{ color: "var(--text-heading)" }}
              >
                {change.title}
              </h4>
            </div>
            <p
              className="mb-3 text-[15px] leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              {change.description}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#059669" }}>
              {change.impact}
            </p>
          </div>
        ))}
      </div>

      {/* Budget + timeline + what we need in a single card */}
      {(recommendation.proposedBudget ??
        recommendation.timeline ??
        recommendation.whatWeNeed) && (
        <div
          className="card-shadow rounded-2xl p-6 backdrop-blur-sm sm:p-8"
          style={{
            border:
              "1px solid color-mix(in srgb, var(--primary) 25%, transparent)",
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--primary) 12%, transparent) 0%, var(--surface-transparent) 100%)",
          }}
        >
          {recommendation.proposedBudget && (
            <>
              <h4
                className="mb-4 text-lg font-semibold sm:text-xl"
                style={{ color: "var(--text-heading)" }}
              >
                Proposed Budget — {recommendation.proposedBudget.total}
              </h4>
              <ul className="mb-6 space-y-2">
                {recommendation.proposedBudget.campaigns.map((campaign) => (
                  <li
                    key={campaign.name}
                    className="flex items-baseline gap-3 text-base leading-relaxed"
                    style={{ color: "var(--text-body)" }}
                  >
                    <span
                      className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: "var(--primary)" }}
                    />
                    <span>
                      <span
                        className="font-semibold"
                        style={{ color: "var(--text-heading)" }}
                      >
                        {campaign.name}
                      </span>{" "}
                      <span style={{ color: "var(--primary)" }}>
                        {campaign.daily}/day
                      </span>{" "}
                      — {campaign.note}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {recommendation.timeline && (
            <p
              className="mb-4 text-base leading-relaxed"
              style={{ color: "var(--text-body)" }}
            >
              <span
                className="font-semibold"
                style={{ color: "var(--text-heading)" }}
              >
                Timeline:
              </span>{" "}
              {recommendation.timeline}
            </p>
          )}

          {recommendation.whatWeNeed && recommendation.whatWeNeed.length > 0 && (
            <>
              <h4
                className="mb-3 text-lg font-semibold"
                style={{ color: "var(--text-heading)" }}
              >
                What We Need From You
              </h4>
              <ul className="space-y-2">
                {recommendation.whatWeNeed.map((item) => (
                  <li
                    key={item}
                    className="flex items-baseline gap-3 text-base leading-relaxed"
                    style={{ color: "var(--text-body)" }}
                  >
                    <span
                      className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: "var(--primary)" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
