import { cookies } from "next/headers";
import { getClient, getClientPassword } from "./clients";

const COOKIE_PREFIX = "auth_";

function cookieName(clientSlug: string) {
  return `${COOKIE_PREFIX}${clientSlug}`;
}

/** Generate a simple token for the auth cookie. */
async function generateToken(clientSlug: string): Promise<string> {
  const secret = process.env.AUTH_SECRET ?? "digitalnova-dev-secret";
  const data = new TextEncoder().encode(`${clientSlug}:${secret}`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Verify a password and return a token cookie value if valid. */
export async function verifyPassword(
  clientSlug: string,
  password: string,
): Promise<string | null> {
  const client = getClient(clientSlug);
  if (!client) return null;
  const master = process.env.MASTER_CLIENT_PASSWORD;
  const expected = getClientPassword(clientSlug);
  const isValid =
    (expected && expected === password) ?? (master && master === password);
  if (!isValid) return null;
  return generateToken(clientSlug);
}

/** Check if the current request is authenticated for a given client. */
export async function isAuthenticated(clientSlug: string): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(cookieName(clientSlug))?.value;
  if (!token) return false;
  const expected = await generateToken(clientSlug);
  return token === expected;
}

/** Set the auth cookie for a client. */
export async function setAuthCookie(
  clientSlug: string,
  token: string,
): Promise<void> {
  const jar = await cookies();
  jar.set(cookieName(clientSlug), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: `/${clientSlug}`,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}
