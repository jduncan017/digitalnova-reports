"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ClientSelector() {
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = slug.trim().toLowerCase();
    if (!trimmed) return;
    setError("");
    router.push(`/${trimmed}/login`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        placeholder="Client ID"
        required
        autoFocus
        className="w-full rounded-xl px-4 py-3.5 text-base text-[#e4e4e7] outline-none backdrop-blur-sm transition placeholder:text-[#52525b]"
        style={{ border: "1px solid rgba(255,255,255,0.08)", backgroundColor: "rgba(15, 17, 21, 0.5)" }}
      />
      <button
        type="submit"
        className="w-full rounded-xl bg-[#1d6ee3] py-3.5 text-base font-medium text-white transition hover:bg-[#1b63cc]"
      >
        Continue
      </button>
      {error && (
        <p className="mt-1 text-center text-[15px] text-red-400">{error}</p>
      )}
    </form>
  );
}
