"use server";

import {
  ALL_SECTION_IDS,
  FIELD_LABELS,
  SECTIONS,
  getRequiredFieldsForSections,
  questionnaireSchema,
  type FieldKey,
  type QuestionnaireData,
  type SectionId,
} from "./schema";

const LOGO_STYLE =
  "display:block; height:24px; width:auto; max-height:24px; max-width:200px; border:0;";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatValue(value: string | string[]): string {
  if (Array.isArray(value)) {
    if (value.length === 0) return "—";
    return value.map((v) => escapeHtml(v)).join(", ");
  }
  const trimmed = value.trim();
  if (!trimmed) return "—";
  return escapeHtml(trimmed).replace(/\n/g, "<br />");
}

function isEmpty(value: QuestionnaireData[FieldKey]): boolean {
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "string") return value.trim().length === 0;
  return value == null;
}

function buildHtml(
  data: QuestionnaireData,
  enabledSections: SectionId[],
): string {
  const enabled = new Set(enabledSections);
  const sectionBlocks = SECTIONS.filter(
    (s) => enabled.has(s.id) && s.fields.length > 0,
  )
    .map((section) => {
      const rows = section.fields
        .map((key) => {
          const value = data[key] as string | string[];
          return `
            <tr>
              <td style="padding: 14px 0 4px; color: #71717a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">${escapeHtml(FIELD_LABELS[key])}</td>
            </tr>
            <tr>
              <td style="padding: 0 0 14px; border-bottom: 1px solid #e4e4e7; color: #27272a; font-size: 15px; line-height: 1.55;">${formatValue(value)}</td>
            </tr>
          `;
        })
        .join("");
      return `
        <h3 style="margin: 28px 0 8px; font-size: 16px; color: #18181b;">${escapeHtml(section.label)}</h3>
        <table style="width: 100%; border-collapse: collapse;">${rows}</table>
      `;
    })
    .join("");

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 640px; margin: 0 auto; color: #27272a;">
      <h2 style="margin: 0 0 4px; font-size: 22px;">Brand Strategy Questionnaire</h2>
      <p style="margin: 0 0 24px; color: #71717a;">From ${escapeHtml(data.respondentName)} (${escapeHtml(data.respondentEmail)}) — ${escapeHtml(data.businessName)}</p>
      ${sectionBlocks}
      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e4e4e7;">
        <img src="https://reports.digitalnovastudio.com/dn-logo-dark.png" alt="DigitalNova Studio" width="120" height="24" style="${LOGO_STYLE}" />
      </div>
    </div>
  `;
}

function sanitizeSections(input: unknown): SectionId[] {
  if (!Array.isArray(input)) return ALL_SECTION_IDS;
  const valid = input.filter((s): s is SectionId =>
    ALL_SECTION_IDS.includes(s as SectionId),
  );
  const merged = new Set<SectionId>(valid);
  for (const s of SECTIONS) {
    if (s.alwaysOn) merged.add(s.id);
  }
  return ALL_SECTION_IDS.filter((id) => merged.has(id));
}

export async function submitQuestionnaire(
  rawData: unknown,
  rawSections: unknown,
): Promise<{ success: boolean; error?: string }> {
  const enabledSections = sanitizeSections(rawSections);

  const parsed = questionnaireSchema.safeParse(rawData);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    const path = first?.path.join(".") ?? "form";
    return {
      success: false,
      error: `Invalid input: ${path} — ${first?.message ?? "validation failed"}`,
    };
  }
  const data = parsed.data;

  // Honeypot — bots fill, humans don't
  if (data.honeypot && data.honeypot.length > 0) {
    return { success: true };
  }

  // Required check — only for fields whose section is enabled
  const required = getRequiredFieldsForSections(enabledSections);
  for (const key of required) {
    if (isEmpty(data[key])) {
      return {
        success: false,
        error: `Missing required field: ${FIELD_LABELS[key]}`,
      };
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  const ownerEmail =
    process.env.FEEDBACK_EMAIL ?? "josh@digitalnovastudio.com";

  if (!apiKey) {
    console.error("RESEND_API_KEY not set — questionnaire not sent");
    return { success: true };
  }

  const html = buildHtml(data, enabledSections);
  const subject = `Brand Questionnaire: ${data.businessName || data.respondentName}`;

  const ownerSend = fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "DigitalNova Studio <reports@digitalnovastudio.com>",
      to: [ownerEmail],
      reply_to: data.respondentEmail,
      subject,
      html,
    }),
  });

  const clientHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; color: #27272a;">
      <h2 style="margin: 0 0 12px;">Thanks, ${escapeHtml(data.respondentName)}!</h2>
      <p style="line-height: 1.6;">I've received your brand questionnaire${data.businessName ? ` for <strong>${escapeHtml(data.businessName)}</strong>` : ""}. I'll review your answers carefully and follow up shortly with next steps.</p>
      <p style="line-height: 1.6;">A copy of your responses is below for your records.</p>
      <div style="margin: 24px 0; padding-top: 16px; border-top: 1px solid #e4e4e7;"></div>
      ${html}
    </div>
  `;

  const clientSend = fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "DigitalNova Studio <reports@digitalnovastudio.com>",
      to: [data.respondentEmail],
      reply_to: ownerEmail,
      subject: `Your Brand Questionnaire${data.businessName ? ` — ${data.businessName}` : ""}`,
      html: clientHtml,
    }),
  });

  const [ownerRes, clientRes] = await Promise.allSettled([
    ownerSend,
    clientSend,
  ]);

  const ownerOk = ownerRes.status === "fulfilled" && ownerRes.value.ok;
  const clientOk = clientRes.status === "fulfilled" && clientRes.value.ok;

  if (!ownerOk) {
    if (ownerRes.status === "fulfilled") {
      console.error(
        "Resend owner email error:",
        await ownerRes.value.text().catch(() => "no body"),
      );
    } else {
      console.error("Resend owner email rejected:", ownerRes.reason);
    }
    return { success: false, error: "Failed to send email" };
  }

  if (!clientOk) {
    if (clientRes.status === "fulfilled") {
      console.error(
        "Resend client email error:",
        await clientRes.value.text().catch(() => "no body"),
      );
    } else {
      console.error("Resend client email rejected:", clientRes.reason);
    }
    // Owner got it — still success from user's POV
  }

  return { success: true };
}
