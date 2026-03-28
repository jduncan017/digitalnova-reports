"use server";

import { redirect } from "next/navigation";
import { verifyAdminPassword, setAdminCookie } from "~/lib/admin-auth";

export async function adminAuthenticate(
  _prevState: string | null,
  formData: FormData,
): Promise<string | null> {
  const password = formData.get("password") as string;

  const token = await verifyAdminPassword(password);
  if (!token) {
    return "Incorrect password.";
  }

  await setAdminCookie(token);
  redirect("/admin");
}
