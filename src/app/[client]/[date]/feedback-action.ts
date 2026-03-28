"use server";

import { getClient } from "~/lib/clients";

type FeedbackData = {
  clientSlug: string;
  clientName: string;
  reportDate: string;
  rating: number | null;
  leadsClosed: number | null;
  leadsValue: number | null;
  comments: string | null;
  sendCopyToClient: boolean;
};

export async function submitFeedback(
  data: FeedbackData,
): Promise<{ success: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.FEEDBACK_EMAIL ?? "josh@digitalnovastudio.com";
  const clientEmails = getClient(data.clientSlug)?.emails ?? [];

  if (!apiKey) {
    console.error("RESEND_API_KEY not set — feedback not sent");
    // Return success anyway in dev so the UI doesn't break
    return { success: true };
  }

  const ratingText = data.rating
    ? `${"★".repeat(data.rating)}${"☆".repeat(5 - data.rating)} (${data.rating}/5)`
    : "Not rated";

  const html = `
    <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto;">
      <h2 style="margin-bottom: 4px;">Report Feedback — ${data.clientName}</h2>
      <p style="color: #71717a; margin-top: 0;">Report: ${data.reportDate}</p>

      <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; color: #71717a; width: 180px;">Usefulness</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; font-weight: 600;">${ratingText}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; color: #71717a;">Leads Closed</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; font-weight: 600;">${data.leadsClosed ?? "—"}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; color: #71717a;">Estimated Value</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; font-weight: 600;">${data.leadsValue !== null ? `$${data.leadsValue.toLocaleString()}` : "—"}</td>
        </tr>
      </table>

      ${
        data.comments
          ? `<div style="margin-top: 16px;">
              <p style="color: #71717a; margin-bottom: 8px; font-size: 14px;">Comments:</p>
              <div style="background: #f4f4f5; padding: 16px; border-radius: 8px; white-space: pre-wrap;">${data.comments}</div>
            </div>`
          : ""
      }
    </div>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "DigitalNova Reports <reports@digitalnovastudio.com>",
        to: [toEmail],
        ...(data.sendCopyToClient && clientEmails.length > 0
          ? { cc: clientEmails }
          : {}),
        ...(clientEmails.length > 0
          ? { reply_to: clientEmails[0] }
          : {}),
        subject: `Report Feedback: ${data.clientName} — ${data.reportDate}`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", err);
      return { success: false };
    }

    return { success: true };
  } catch (err) {
    console.error("Feedback send failed:", err);
    return { success: false };
  }
}
