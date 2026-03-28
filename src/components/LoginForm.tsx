"use client";

import Image from "next/image";
import { useActionState } from "react";
import { authenticate } from "~/app/[client]/login/actions";

export function LoginForm({
  clientSlug,
  clientName,
  dnLogo = "/dn-logo.png",
  splash,
}: {
  clientSlug: string;
  clientName: string;
  dnLogo?: string;
  splash?: string;
}) {
  const [error, formAction, isPending] = useActionState(
    authenticate.bind(null, clientSlug),
    null,
  );

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      {/* Left: form */}
      <div
        className="flex flex-1 items-center justify-center px-6"
        style={{
          background:
            "linear-gradient(to bottom right, color-mix(in srgb, var(--primary) 20%, var(--bg)), var(--bg))",
        }}
      >
        <div
          className="w-full max-w-xl rounded-2xl p-6 sm:p-16 xl:p-20"
          style={{
            border: "1px solid var(--border)",
            backgroundColor: "var(--surface-transparent)",
          }}
        >
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
              className="w-full rounded-xl px-4 py-3.5 text-base backdrop-blur-sm transition outline-none"
              style={{
                border: "1px solid var(--border)",
                backgroundColor:
                  "color-mix(in srgb, var(--bg) 50%, transparent)",
                color: "var(--text-heading)",
              }}
            />
            <button
              type="submit"
              disabled={isPending}
              className="w-full cursor-pointer rounded-xl py-3.5 text-base font-medium text-white transition hover:brightness-110 disabled:opacity-50"
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

      {/* Right: splash image */}
      {splash && (
        <div className="relative hidden w-1/3 2xl:block">
          <Image
            src={splash}
            alt=""
            fill
            unoptimized
            className="object-cover"
          />
          {/* Shadow cast from content panel over the image */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12"
            style={{
              background:
                "linear-gradient(to right, rgba(0,0,0,0.35), rgba(0,0,0,0.1) 40%, transparent)",
            }}
          />
        </div>
      )}
    </div>
  );
}
