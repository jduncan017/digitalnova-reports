"use client";

import Image from "next/image";
import { useActionState } from "react";
import { authenticate } from "~/app/[client]/login/actions";

export function LoginForm({
  clientSlug,
  clientName,
  dnLogo = "/dn-logo.png",
}: {
  clientSlug: string;
  clientName: string;
  dnLogo?: string;
}) {
  const [error, formAction, isPending] = useActionState(
    authenticate.bind(null, clientSlug),
    null,
  );

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <Image
            src={dnLogo}
            alt="DigitalNova Studio"
            width={200}
            height={60}
            unoptimized
            className="mx-auto mb-8 h-10 w-auto"
          />
          <h1
            className="mb-1.5 text-2xl font-semibold tracking-tight"
            style={{ color: "var(--text-heading)" }}
          >
            {clientName}
          </h1>
          <p className="text-base" style={{ color: "var(--text-muted)" }}>
            Enter your password to view reports
          </p>
        </div>
        <form action={formAction} className="space-y-4">
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            autoFocus
            className="w-full rounded-xl px-4 py-3.5 text-base outline-none backdrop-blur-sm transition"
            style={{
              border: "1px solid var(--border)",
              backgroundColor: "var(--surface-transparent)",
              color: "var(--text-heading)",
            }}
          />
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl py-3.5 text-base font-medium text-white transition disabled:opacity-50"
            style={{ backgroundColor: "var(--primary)" }}
          >
            {isPending ? "Checking..." : "View Reports"}
          </button>
          {error && (
            <p className="mt-1 text-center text-[15px] text-red-400">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
