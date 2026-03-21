export function NextSteps({ steps }: { steps: string[] }) {
  return (
    <div
      className="rounded-2xl p-6 backdrop-blur-sm sm:p-8"
      style={{
        border:
          "1px solid color-mix(in srgb, var(--primary) 25%, transparent)",
        background:
          "linear-gradient(135deg, color-mix(in srgb, var(--primary) 12%, transparent) 0%, var(--surface-transparent) 100%)",
      }}
    >
      <h3
        className="mb-5 text-lg font-semibold"
        style={{ color: "var(--text-heading)" }}
      >
        What We&apos;re Watching
      </h3>
      <ul className="space-y-3">
        {steps.map((step) => (
          <li
            key={step}
            className="relative pl-6 text-base leading-relaxed"
            style={{ color: "var(--text-body)" }}
          >
            <span
              className="absolute left-0"
              style={{ color: "var(--secondary)" }}
            >
              →
            </span>
            {step}
          </li>
        ))}
      </ul>
    </div>
  );
}
