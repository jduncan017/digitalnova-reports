import { type Action } from "~/lib/types";

function ActionItem({ action, index }: { action: Action; index: number }) {
  const isDone = action.status === "done";

  return (
    <div
      className="card-shadow rounded-2xl p-4 backdrop-blur-sm sm:p-6"
      style={{
        border: "1px solid var(--border)",
        backgroundColor: "var(--surface-transparent)",
      }}
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span
            className="text-xl font-bold"
            style={{ color: "var(--primary)" }}
          >
            {index + 1})
          </span>
          <h4
            className="text-base font-medium sm:text-lg"
            style={{ color: "var(--text-heading)" }}
          >
            {action.title}
          </h4>
        </div>
        <span
          className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium"
          style={{
            backgroundColor: isDone
              ? "rgba(5, 150, 105, 0.15)"
              : "rgba(245, 158, 11, 0.15)",
            color: isDone ? "#059669" : "#f59e0b",
          }}
        >
          {isDone ? "Done" : "Pending"}
        </span>
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
