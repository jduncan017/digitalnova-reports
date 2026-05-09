"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Copy, ExternalLink, Check, ArrowLeft } from "lucide-react";
import {
  ALL_SECTION_IDS,
  SECTIONS,
  isFieldRequired,
  type SectionId,
} from "~/app/brand-questionnaire/schema";

export function Builder({ baseUrl }: { baseUrl: string }) {
  const [enabled, setEnabled] = useState<Set<SectionId>>(
    () => new Set(ALL_SECTION_IDS),
  );
  const [copied, setCopied] = useState(false);

  function toggle(id: SectionId) {
    const section = SECTIONS.find((s) => s.id === id);
    if (section?.alwaysOn) return; // can't disable always-on
    setEnabled((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function selectAll() {
    setEnabled(new Set(ALL_SECTION_IDS));
  }

  function selectMinimal() {
    const next = new Set<SectionId>();
    for (const s of SECTIONS) {
      if (s.alwaysOn) next.add(s.id);
    }
    setEnabled(next);
  }

  const url = useMemo(() => {
    const enabledIds = ALL_SECTION_IDS.filter((id) => enabled.has(id));
    const allEnabled = enabledIds.length === ALL_SECTION_IDS.length;
    if (allEnabled) {
      return `${baseUrl}/brand-questionnaire`;
    }
    // Omit alwaysOn sections from URL — server adds them back
    const params = enabledIds.filter(
      (id) => !SECTIONS.find((s) => s.id === id)?.alwaysOn,
    );
    return `${baseUrl}/brand-questionnaire?sections=${params.join(",")}`;
  }, [enabled, baseUrl]);

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  const enabledCount = SECTIONS.filter((s) => enabled.has(s.id)).length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-[#a1a1aa] transition hover:text-[#e4e4e7]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to admin
        </Link>
        <div className="flex gap-2">
          <button
            onClick={selectAll}
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-[#d4d4d8] transition hover:border-white/20"
          >
            Select all
          </button>
          <button
            onClick={selectMinimal}
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-[#d4d4d8] transition hover:border-white/20"
          >
            Minimum
          </button>
        </div>
      </div>

      {/* Section checkboxes */}
      <div className="space-y-2">
        {SECTIONS.map((section) => {
          const checked = enabled.has(section.id);
          const requiredCount = section.fields.filter((f) =>
            isFieldRequired(f),
          ).length;
          return (
            <label
              key={section.id}
              className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition ${
                checked
                  ? "border-[#a78bfa] bg-[#a78bfa]/10"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20"
              } ${section.alwaysOn ? "cursor-not-allowed opacity-90" : ""}`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={section.alwaysOn}
                  onChange={() => toggle(section.id)}
                  className="h-4 w-4 accent-[#a78bfa]"
                />
                <div>
                  <div className="text-sm font-medium text-[#e4e4e7]">
                    {section.label}
                    {section.alwaysOn && (
                      <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#a1a1aa]">
                        Always
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#71717a]">
                    {section.fields.length} field
                    {section.fields.length !== 1 ? "s" : ""}
                    {requiredCount > 0 && ` · ${requiredCount} required`}
                  </div>
                </div>
              </div>
              <code className="text-xs text-[#52525b]">{section.id}</code>
            </label>
          );
        })}
      </div>

      {/* URL preview */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-[#71717a]">
            Generated URL
          </span>
          <span className="text-xs text-[#a1a1aa]">
            {enabledCount} of {SECTIONS.length} sections
          </span>
        </div>
        <div className="flex items-stretch gap-2">
          <code className="block flex-1 overflow-x-auto rounded-lg border border-white/10 bg-[#0a0c10] px-3 py-2.5 text-xs text-[#e4e4e7]">
            {url}
          </code>
          <button
            onClick={copyUrl}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs font-medium text-[#e4e4e7] transition hover:border-white/20 hover:bg-white/[0.06]"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy
              </>
            )}
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#a78bfa] px-3 py-2.5 text-xs font-medium text-white transition hover:bg-[#8b6df0]"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open
          </a>
        </div>
      </div>
    </div>
  );
}
