import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Calendar, FileText, TrendingUp } from "lucide-react";
import { getClient, getDnLogo } from "~/lib/clients";
import { MetricCard } from "~/components/MetricCard";
import { isAuthenticated } from "~/lib/auth";
import { getReportDates, getReport } from "~/lib/reports";
import { ReportFooter } from "~/components/ReportFooter";

export default async function ClientDashboard({
  params,
}: {
  params: Promise<{ client: string }>;
}) {
  const { client: clientSlug } = await params;
  const client = getClient(clientSlug);
  if (!client) notFound();

  if (!(await isAuthenticated(clientSlug))) {
    redirect(`/${clientSlug}/login`);
  }

  const dates = await getReportDates(clientSlug);
  const latestReport = dates[0] ? await getReport(clientSlug, dates[0]) : null;

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: "var(--bg)" }}
    >
      {/* Header */}
      <div
        className="header-shadow px-6 py-10 sm:px-10 sm:py-14"
        style={{
          background:
            "linear-gradient(to bottom right, color-mix(in srgb, var(--primary) 20%, transparent), var(--surface))",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="mx-auto max-w-[1100px]">
          <div className="flex items-center gap-5">
            {client.logo && (
              <Image
                src={client.logo}
                alt={client.name}
                width={80}
                height={80}
                unoptimized
                className="h-20 w-20 rounded-2xl object-contain p-2.5"
                style={{
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg)",
                }}
              />
            )}
            <div>
              <h1
                className="text-2xl font-semibold tracking-tight sm:text-3xl"
                style={{ color: "var(--text-heading)" }}
              >
                {client.name}
              </h1>
              <p
                className="mt-1 text-base"
                style={{ color: "var(--text-muted)" }}
              >
                Client Dashboard
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1100px] px-6 py-20 sm:px-20">
        {/* Stats row */}
        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div
            className="card-shadow rounded-2xl p-5 backdrop-blur-sm"
            style={{
              border: "1px solid var(--border)",
              backgroundColor: "var(--surface-transparent)",
            }}
          >
            <div
              className="mb-1.5 flex items-center gap-2 text-xs font-medium tracking-wider uppercase"
              style={{ color: "var(--text-muted)" }}
            >
              <FileText className="h-4 w-4" />
              Total Reports
            </div>
            <div
              className="text-2xl font-semibold"
              style={{ color: "var(--text-heading)" }}
            >
              {dates.length}
            </div>
          </div>
          {latestReport && (
            <>
              <div
                className="card-shadow rounded-2xl p-5 backdrop-blur-sm"
                style={{
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--surface-transparent)",
                }}
              >
                <div
                  className="mb-1.5 flex items-center gap-2 text-xs font-medium tracking-wider uppercase"
                  style={{ color: "var(--text-muted)" }}
                >
                  <Calendar className="h-4 w-4" />
                  Latest Report
                </div>
                <div
                  className="text-2xl font-semibold"
                  style={{ color: "var(--text-heading)" }}
                >
                  {latestReport.date}
                </div>
              </div>
              <div
                className="card-shadow col-span-2 rounded-2xl p-5 backdrop-blur-sm sm:col-span-1"
                style={{
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--surface-transparent)",
                }}
              >
                <div
                  className="mb-1.5 flex items-center gap-2 text-xs font-medium tracking-wider uppercase"
                  style={{ color: "var(--text-muted)" }}
                >
                  <TrendingUp className="h-4 w-4" />
                  Platform
                </div>
                <div
                  className="text-2xl font-semibold"
                  style={{ color: "var(--text-heading)" }}
                >
                  {latestReport.platform}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Latest report preview */}
        {latestReport && (
          <div className="mb-10">
            <div className="mb-4 flex items-center justify-between">
              <h2
                className="text-xl font-semibold"
                style={{ color: "var(--text-heading)" }}
              >
                Latest Report Summary
              </h2>
              <Link
                href={`/${clientSlug}/${latestReport.date}`}
                className="text-[15px] transition hover:opacity-80"
                style={{ color: "var(--primary)" }}
              >
                View full report →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {latestReport.metrics.map((m) => (
                <MetricCard key={m.label} metric={m} />
              ))}
            </div>
          </div>
        )}

        {/* Report history */}
        <div>
          <h2
            className="mb-4 text-xl font-semibold"
            style={{ color: "var(--text-heading)" }}
          >
            All Reports
          </h2>
          {dates.length === 0 ? (
            <p className="text-base" style={{ color: "var(--text-muted)" }}>
              No reports available yet.
            </p>
          ) : (
            <div className="space-y-3">
              {dates.map((date, i) => (
                <Link
                  key={date}
                  href={`/${clientSlug}/${date}`}
                  className="report-link group flex items-center justify-between rounded-xl px-5 py-4 backdrop-blur-sm transition"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor:
                          "color-mix(in srgb, var(--primary) 15%, transparent)",
                      }}
                    >
                      <FileText
                        className="h-5 w-5"
                        style={{ color: "var(--primary)" }}
                      />
                    </div>
                    <div>
                      <div
                        className="text-base font-medium"
                        style={{ color: "var(--text-heading)" }}
                      >
                        Weekly Report — {date}
                      </div>
                      <div
                        className="text-sm"
                        style={{ color: "var(--text-faint)" }}
                      >
                        {i === 0 ? "Latest" : `Week ${dates.length - i}`}
                      </div>
                    </div>
                  </div>
                  <span
                    className="text-[15px] transition"
                    style={{ color: "var(--text-faint)" }}
                  >
                    View →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <ReportFooter dnLogo={getDnLogo(client)} />
    </div>
  );
}
