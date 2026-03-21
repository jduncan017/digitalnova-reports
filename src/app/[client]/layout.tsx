import { notFound } from "next/navigation";
import { getClient } from "~/lib/clients";

export default async function ClientLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ client: string }>;
}) {
  const { client: clientSlug } = await params;
  const client = getClient(clientSlug);
  if (!client) notFound();

  const { brand } = client;

  return (
    <div
      style={
        {
          "--bg": brand.background,
          "--surface": brand.surface,
          "--primary": brand.primary,
          "--text-heading": brand.dark ? "#ffffff" : "#0f0f0f",
          "--text-body": brand.dark ? "#a1a1aa" : "#27272a",
          "--text-muted": brand.dark ? "#71717a" : "#52525b",
          "--text-faint": brand.dark ? "#52525b" : "#a1a1aa",
          "--border": brand.dark
            ? "rgba(255,255,255,0.06)"
            : "rgba(0,0,0,0.08)",
          "--border-hover": brand.dark
            ? "rgba(255,255,255,0.12)"
            : "rgba(0,0,0,0.15)",
          "--surface-hover": brand.dark
            ? "rgba(255,255,255,0.05)"
            : "rgba(0,0,0,0.03)",
          "--surface-transparent": brand.dark
            ? "rgba(255,255,255,0.03)"
            : "rgba(0,0,0,0.02)",
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
