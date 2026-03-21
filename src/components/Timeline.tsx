import { type Action } from "~/lib/types";

function TimelineItem({ action }: { action: Action }) {
  return (
    <div className="relative mb-7 pl-8">
      <div
        className="absolute left-0 top-1.5 h-3 w-3 rounded-full"
        style={{
          backgroundColor:
            action.status === "done" ? "#34d399" : "var(--secondary)",
          border: "2px solid var(--bg)",
        }}
      />
      <h4
        className="mb-1 text-base font-medium"
        style={{ color: "var(--text-heading)" }}
      >
        {action.title}
      </h4>
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
    <div className="relative mb-12 pl-2">
      <div
        className="absolute bottom-2 left-[7px] top-2 w-0.5"
        style={{ backgroundColor: "var(--border)" }}
      />
      {actions.map((a) => (
        <TimelineItem key={a.title} action={a} />
      ))}
    </div>
  );
}
