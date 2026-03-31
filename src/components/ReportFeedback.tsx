"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { submitFeedback } from "~/app/[client]/[date]/feedback-action";

const ratings = [1, 2, 3, 4, 5] as const;
const ratingLabels = [
  "Not useful",
  "Slightly",
  "Useful",
  "Very useful",
  "Excellent",
];

export function ReportFeedback({
  clientSlug,
  clientName,
  reportDate,
  clientEmails,
  isMonthly,
}: {
  clientSlug: string;
  clientName: string;
  reportDate: string;
  clientEmails: string[];
  isMonthly?: boolean;
}) {
  const [rating, setRating] = useState<number | null>(null);
  const [leadsClosed, setLeadsClosed] = useState("");
  const [leadsValue, setLeadsValue] = useState("");
  const [comments, setComments] = useState("");
  const [sendCopy, setSendCopy] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    const result = await submitFeedback({
      clientSlug,
      clientName,
      reportDate,
      rating,
      leadsClosed: leadsClosed ? parseInt(leadsClosed, 10) : null,
      leadsValue: leadsValue ? parseFloat(leadsValue) : null,
      comments: comments.trim() || null,
      sendCopyToClient: sendCopy,
    });

    setStatus(result.success ? "sent" : "error");
  }

  if (status === "sent") {
    return (
      <div
        className="pt-8"
        style={{
          borderTop: "1px solid var(--border)",
        }}
      >
        <div
          className="text-xl font-semibold"
          style={{ color: "var(--text-heading)" }}
        >
          Thanks for your feedback!
        </div>
        <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
          We&apos;ll factor this into the next report.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card-shadow w-full rounded-2xl p-6 backdrop-blur-sm sm:p-8"
      style={{
        border: "1px solid var(--border)",
        backgroundColor: "var(--surface-transparent)",
      }}
    >
        <h3
          className="mb-1 text-xl font-semibold"
          style={{ color: "var(--text-heading)" }}
        >
          Report Feedback
        </h3>
        <p className="mb-6 text-sm" style={{ color: "var(--text-muted)" }}>
          Help us improve — takes 30 seconds.
        </p>

        {/* Rating */}
        <div className="mb-6">
          <label
            className="mb-3 block text-sm font-medium"
            style={{ color: "var(--text-body)" }}
          >
            How useful was this report?
          </label>
          <div className="flex items-center gap-2">
            {ratings.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRating(r)}
                className={`flex h-11 w-11 items-center justify-center rounded-xl text-sm font-semibold ${rating === r ? "feedback-rating-active" : "feedback-btn"}`}
                style={
                  rating === r
                    ? {
                        border: "2px solid var(--primary)",
                        backgroundColor:
                          "color-mix(in srgb, var(--primary) 20%, transparent)",
                        color: "var(--primary)",
                        boxShadow:
                          "0 0 12px color-mix(in srgb, var(--primary) 25%, transparent)",
                      }
                    : {
                        border: "1px solid var(--border)",
                        backgroundColor: "color-mix(in srgb, var(--bg) 80%, white)",
                      }
                }
              >
                {r}
              </button>
            ))}
            {rating !== null && (
              <span
                className="ml-2 text-sm font-medium"
                style={{ color: "var(--primary)" }}
              >
                {ratingLabels[rating - 1]}
              </span>
            )}
          </div>
        </div>

        {/* Leads closed */}
        <div className="mb-6">
          <label
            className="mb-2 block text-sm font-medium"
            style={{ color: "var(--text-body)" }}
          >
            How many leads did you close{" "}
            {isMonthly ? "this month" : "this week"} from our funnel?
          </label>
          <input
            type="number"
            min="0"
            value={leadsClosed}
            onChange={(e) => setLeadsClosed(e.target.value)}
            placeholder="0"
            className="w-full max-w-[200px] rounded-lg px-3 py-2.5 text-sm transition outline-none focus:ring-2"
            style={{
              border: "1px solid var(--border)",
              backgroundColor: "color-mix(in srgb, var(--bg) 80%, white)",
              color: "var(--text-heading)",
              // @ts-expect-error CSS custom property for ring color
              "--tw-ring-color":
                "color-mix(in srgb, var(--primary) 40%, transparent)",
            }}
          />
        </div>

        {/* Leads value */}
        <div className="mb-6">
          <label
            className="mb-2 block text-sm font-medium"
            style={{ color: "var(--text-body)" }}
          >
            Estimated value of leads closed{" "}
            {isMonthly ? "this month" : "this week"}?
            <span
              className="ml-1 font-normal"
              style={{ color: "var(--text-muted)" }}
            >
              (optional)
            </span>
          </label>
          <div className="relative w-full max-w-[200px]">
            <span
              className="absolute top-1/2 left-3 -translate-y-1/2 text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              $
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={leadsValue}
              onChange={(e) => setLeadsValue(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-lg py-2.5 pr-3 pl-7 text-sm transition outline-none focus:ring-2"
              style={{
                border: "1px solid var(--border)",
                backgroundColor: "color-mix(in srgb, var(--bg) 80%, white)",
                color: "var(--text-heading)",
                // @ts-expect-error CSS custom property for ring color
                "--tw-ring-color":
                  "color-mix(in srgb, var(--primary) 40%, transparent)",
              }}
            />
          </div>
        </div>

        {/* Comments */}
        <div className="mb-6 max-w-[600px]">
          <label
            className="mb-2 block text-sm font-medium"
            style={{ color: "var(--text-body)" }}
          >
            Questions or feedback for next week?
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Anything you'd like us to focus on, change, or investigate..."
            rows={3}
            className="w-full resize-none rounded-lg px-3 py-2.5 text-sm transition outline-none focus:ring-2"
            style={{
              border: "1px solid var(--border)",
              backgroundColor: "color-mix(in srgb, var(--bg) 80%, white)",
              color: "var(--text-heading)",
              // @ts-expect-error CSS custom property for ring color
              "--tw-ring-color":
                "color-mix(in srgb, var(--primary) 40%, transparent)",
            }}
          />
        </div>

        {/* Send copy checkbox */}
        {clientEmails.length > 0 && (
          <label className="mb-6 flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={sendCopy}
              onChange={(e) => setSendCopy(e.target.checked)}
              className="accent-(--primary)] h-4 w-4 cursor-pointer rounded"
            />
            <span className="text-sm" style={{ color: "var(--text-body)" }}>
              Send me a copy of this feedback
            </span>
          </label>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={status === "sending"}
          className="feedback-submit flex cursor-pointer items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-white transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            backgroundColor: "var(--primary)",
            boxShadow:
              "0 2px 8px color-mix(in srgb, var(--primary) 30%, transparent)",
          }}
        >
          <Send className="h-4 w-4" />
          {status === "sending" ? "Sending..." : "Send Feedback"}
        </button>

        {status === "error" && (
          <p className="mt-3 text-sm text-red-400">
            Something went wrong. Please try again.
          </p>
        )}
    </form>
  );
}
