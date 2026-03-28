"use client";

import { useState } from "react";
import { X, Copy, Check, Send, Mail } from "lucide-react";
import { sendNotification } from "~/app/admin/notify-action";

type ClientInfo = {
  slug: string;
  name: string;
  emails: string[];
  lastReportDate: string | null;
  dashboardUrl: string;
  password: string;
};

function generateDraft(client: ClientInfo): { subject: string; message: string } {
  const subject = `Your Weekly Report is Ready — ${client.name}`;
  const message = `Hi there,

Your latest report for the week ending ${client.lastReportDate ?? "[date]"} is now available.

You can view it here:
${client.dashboardUrl}

Password: ${client.password}

Let me know if you have any questions or feedback — there's also a quick feedback form at the bottom of the report.

Best,
Josh
DigitalNova Studio`;

  return { subject, message };
}

export function NotifyButton({ client }: { client: ClientInfo }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] px-3 py-1.5 text-sm text-[#71717a] transition-all duration-150 hover:border-[rgba(255,255,255,0.15)] hover:bg-white/5 hover:text-[#e4e4e7] active:scale-[0.97]"
      >
        <Mail className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Notify</span>
      </button>
      {open && <NotifyModal client={client} onClose={() => setOpen(false)} />}
    </>
  );
}

function NotifyModal({
  client,
  onClose,
}: {
  client: ClientInfo;
  onClose: () => void;
}) {
  const draft = generateDraft(client);
  const [subject, setSubject] = useState(draft.subject);
  const [message, setMessage] = useState(draft.message);
  const [copied, setCopied] = useState(false);
  const [sendStatus, setSendStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleCopy() {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSend() {
    setSendStatus("sending");
    setErrorMsg("");
    const result = await sendNotification({
      clientName: client.name,
      emails: client.emails,
      subject,
      message,
    });
    if (result.success) {
      setSendStatus("sent");
    } else {
      setSendStatus("error");
      setErrorMsg(result.error ?? "Unknown error");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg rounded-2xl p-6"
        style={{
          backgroundColor: "#1a1c22",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Header */}
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[#e4e4e7]">
              Notify {client.name}
            </h3>
            {client.emails.length > 0 ? (
              <p className="mt-1 text-sm text-[#71717a]">
                To: {client.emails.join(", ")}
              </p>
            ) : (
              <p className="mt-1 text-sm text-amber-400">
                No email configured — use copy instead
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1.5 text-[#71717a] transition-all duration-150 hover:bg-white/5 hover:text-[#e4e4e7] active:scale-90"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Subject */}
        <div className="mb-3">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[#71717a]">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-lg bg-[#0f1115] px-3 py-2.5 text-sm text-[#e4e4e7] outline-none"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          />
        </div>

        {/* Message */}
        <div className="mb-5">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[#71717a]">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={12}
            className="w-full resize-none rounded-lg bg-[#0f1115] px-3 py-2.5 text-sm leading-relaxed text-[#e4e4e7] outline-none"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-[#e4e4e7] transition-all duration-150 hover:bg-white/8 active:scale-[0.97]"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Text
              </>
            )}
          </button>

          {client.emails.length > 0 && (
            <button
              onClick={handleSend}
              disabled={sendStatus === "sending" || sendStatus === "sent"}
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#1d6ee3] px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-150 hover:bg-[#2578f0] hover:shadow-lg active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sendStatus === "sending" ? (
                "Sending..."
              ) : sendStatus === "sent" ? (
                <>
                  <Check className="h-4 w-4" />
                  Sent!
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Email
                </>
              )}
            </button>
          )}
        </div>

        {sendStatus === "error" && (
          <p className="mt-3 text-sm text-red-400">{errorMsg}</p>
        )}
      </div>
    </div>
  );
}
