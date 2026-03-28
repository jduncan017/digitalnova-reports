import { cookies } from "next/headers";

const ADMIN_COOKIE = "admin_auth";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "dn-admin-2026";

async function generateAdminToken(): Promise<string> {
  const secret = process.env.AUTH_SECRET ?? "digitalnova-dev-secret";
  const data = new TextEncoder().encode(`admin:${secret}`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyAdminPassword(
  password: string,
): Promise<string | null> {
  if (password !== ADMIN_PASSWORD) return null;
  return generateAdminToken();
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  const expected = await generateAdminToken();
  return token === expected;
}

export async function setAdminCookie(token: string): Promise<void> {
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}
