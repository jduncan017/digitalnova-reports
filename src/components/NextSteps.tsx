export function NextSteps({ steps }: { steps: string[] }) {
  return (
    <div
      className="card-shadow rounded-2xl p-6 backdrop-blur-sm sm:p-8"
      style={{
        border:
          "1px solid color-mix(in srgb, var(--primary) 25%, transparent)",
        background:
          "linear-gradient(135deg, color-mix(in srgb, var(--primary) 12%, transparent) 0%, var(--surface-transparent) 100%)",
      }}
    >
      <h3
        className="mb-5 text-xl font-semibold"
        style={{ color: "var(--text-heading)" }}
      >
        What We&apos;re Watching
      </h3>
      <ul className="space-y-3">
        {steps.map((step) => (
          <li
            key={step}
            className="flex items-baseline gap-3 text-base leading-relaxed sm:text-lg"
            style={{ color: "var(--text-body)" }}
          >
            <span
              className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: "var(--primary)" }}
            />
            {step}
          </li>
        ))}
      </ul>
    </div>
  );
}
