import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink, Archive } from "lucide-react";
import { isAdminAuthenticated } from "~/lib/admin-auth";
import { getArchivedClientSlugs, getClient } from "~/lib/clients";
import { getReportDates, formatDate } from "~/lib/reports";

type ArchivedClientSummary = {
  slug: string;
  name: string;
  logo?: string;
  archivedAt?: string;
  archivedReason?: string;
  reportCount: number;
  lastReportDate: string | null;
};

async function getArchivedSummaries(): Promise<ArchivedClientSummary[]> {
  const slugs = getArchivedClientSlugs();
  const summaries: ArchivedClientSummary[] = [];

  for (const slug of slugs) {
    const client = getClient(slug);
    if (!client) continue;

    const dates = await getReportDates(slug);

    summaries.push({
      slug,
      name: client.name,
      logo: client.logo,
      archivedAt: client.archivedAt,
      archivedReason: client.archivedReason,
      reportCount: dates.length,
      lastReportDate: dates[0] ?? null,
    });
  }

  return summaries.sort((a, b) => {
    const ad = a.archivedAt ?? "";
    const bd = b.archivedAt ?? "";
    return bd.localeCompare(ad);
  });
}

export default async function ArchivedClientsPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const clients = await getArchivedSummaries();

  return (
    <div className="min-h-screen bg-[#0f1115]">
      {/* Header */}
      <div
        className="border-b px-6 py-8 sm:px-10"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="mx-auto max-w-[1100px]">
          <Link
            href="/admin"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-[#71717a] transition hover:text-[#e4e4e7]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to admin
          </Link>
          <div className="flex items-center gap-3">
            <Archive className="h-6 w-6 text-[#71717a]" />
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-[#e4e4e7]">
                Archived Clients
              </h1>
              <p className="mt-1 text-sm text-[#71717a]">
                Report history remains accessible. No freshness alerts.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1100px] px-6 py-10 sm:px-10">
        {clients.length === 0 ? (
          <div
            className="flex items-center justify-center rounded-xl py-12"
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              backgroundColor: "rgba(255,255,255,0.02)",
            }}
          >
            <div className="text-center">
              <Archive className="mx-auto mb-2 h-8 w-8 text-[#52525b]" />
              <p className="text-sm text-[#71717a]">No archived clients</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {clients.map((client) => (
              <div
                key={client.slug}
                className="flex items-center justify-between rounded-xl p-4 sm:p-5"
                style={{
                  border: "1px solid rgba(255,255,255,0.08)",
                  backgroundColor: "rgba(255,255,255,0.02)",
                  opacity: 0.85,
                }}
              >
                <div className="flex items-center gap-4">
                  {client.logo && (
                    <Image
                      src={client.logo}
                      alt={client.name}
                      width={40}
                      height={40}
                      unoptimized
                      className="h-10 w-10 rounded-lg object-contain p-1 grayscale"
                      style={{
                        border: "1px solid rgba(255,255,255,0.08)",
                        backgroundColor: "rgba(255,255,255,0.03)",
                      }}
                    />
                  )}
                  <div>
                    <Link
                      href={`/${client.slug}`}
                      className="flex items-center gap-1.5 text-base font-medium text-[#e4e4e7] transition hover:text-[#60a5fa]"
                    >
                      {client.name}
                      <ExternalLink className="h-3.5 w-3.5 text-[#52525b]" />
                    </Link>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#71717a]">
                      <span>
                        Archived
                        {client.archivedAt
                          ? ` ${formatDate(client.archivedAt)}`
                          : ""}
                      </span>
                      {client.archivedReason && (
                        <>
                          <span className="hidden sm:inline">·</span>
                          <span>{client.archivedReason}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-[#e4e4e7]">
                    {client.reportCount} report
                    {client.reportCount !== 1 ? "s" : ""}
                  </div>
                  {client.lastReportDate && (
                    <div className="text-xs text-[#71717a]">
                      last {formatDate(client.lastReportDate)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
