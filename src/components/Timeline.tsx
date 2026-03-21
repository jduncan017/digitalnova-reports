import { type Action } from "~/lib/types";

function ActionItem({ action, index }: { action: Action; index: number }) {
  return (
    <div
      className="rounded-2xl p-6 backdrop-blur-sm"
      style={{
        border: "1px solid var(--border)",
        backgroundColor: "var(--surface-transparent)",
      }}
    >
      <div className="mb-2 flex items-baseline gap-2">
        <span
          className="text-lg font-bold"
          style={{ color: action.status === "done" ? "#34d399" : "var(--secondary)" }}
        >
          {index + 1})
        </span>
        <h4
          className="text-base font-medium"
          style={{ color: "var(--text-heading)" }}
        >
          {action.title}
        </h4>
      </div>
      <p
        className="text-[15px] leading-relaxed"
        style={{ color: "var(--text-muted)" }}
      >
        {action.description}
      </p>
    </div>
  );
}

export function Timeline({ actions }: { actions: Action[] }) {
  return (
    <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {actions.map((a, i) => (
        <ActionItem key={a.title} action={a} index={i} />
      ))}
    </div>
  );
}
