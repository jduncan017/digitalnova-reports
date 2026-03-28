"use server";

import { isAdminAuthenticated } from "~/lib/admin-auth";

type NotifyData = {
  clientName: string;
  emails: string[];
  subject: string;
  message: string;
};

export async function sendNotification(
  data: NotifyData,
): Promise<{ success: boolean; error?: string }> {
  if (!(await isAdminAuthenticated())) {
    return { success: false, error: "Not authenticated" };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { success: false, error: "RESEND_API_KEY not configured" };
  }

  if (data.emails.length === 0) {
    return { success: false, error: "No email addresses configured for this client" };
  }

  const html = `
    <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto;">
      <div style="white-space: pre-wrap; line-height: 1.6; color: #27272a; font-size: 15px;">${data.message}</div>
      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e4e4e7;">
        <img src="https://reports.digitalnovastudio.com/dn-logo-dark.png" alt="DigitalNova Studio" height="24" />
      </div>
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
        from: "DigitalNova Studio <reports@digitalnovastudio.com>",
        to: data.emails,
        subject: data.subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", err);
      return { success: false, error: "Failed to send email" };
    }

    return { success: true };
  } catch (err) {
    console.error("Notification send failed:", err);
    return { success: false, error: "Failed to send email" };
  }
}
