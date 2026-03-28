"use client";

import { useActionState } from "react";
import { adminAuthenticate } from "~/app/admin/login/actions";

export function AdminLoginForm() {
  const [error, formAction, isPending] = useActionState(
    adminAuthenticate,
    null,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input
        type="password"
        name="password"
        placeholder="Password"
        required
        autoFocus
        className="w-full rounded-xl px-4 py-3.5 text-base text-[#e4e4e7] outline-none backdrop-blur-sm transition placeholder:text-[#52525b]"
        style={{ border: "1px solid rgba(255,255,255,0.08)", backgroundColor: "rgba(15, 17, 21, 0.5)" }}
      />
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-[#1d6ee3] py-3.5 text-base font-medium text-white transition hover:bg-[#1b63cc] disabled:opacity-50"
      >
        {isPending ? "Checking..." : "Log In"}
      </button>
      {error && (
        <p className="mt-1 text-center text-[15px] text-red-400">{error}</p>
      )}
    </form>
  );
}
