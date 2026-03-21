export function SectionHeader({
  label,
  title,
}: {
  label: string;
  title: string;
}) {
  return (
    <div className="mb-6">
      <div
        className="mb-1.5 text-base font-medium uppercase tracking-widest"
        style={{ color: "var(--primary)" }}
      >
        {label}
      </div>
      <h2
        className="text-3xl font-semibold tracking-tight"
        style={{ color: "var(--text-heading)" }}
      >
        {title}
      </h2>
    </div>
  );
}
