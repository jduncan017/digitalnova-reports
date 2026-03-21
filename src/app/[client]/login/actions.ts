"use server";

import { redirect } from "next/navigation";
import { verifyPassword, setAuthCookie } from "~/lib/auth";

export async function authenticate(
  clientSlug: string,
  _prevState: string | null,
  formData: FormData,
): Promise<string | null> {
  const password = formData.get("password") as string;

  const token = await verifyPassword(clientSlug, password);
  if (!token) {
    return "Incorrect password. Please try again.";
  }

  await setAuthCookie(clientSlug, token);
  redirect(`/${clientSlug}`);
}
