import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  FileText,
  Clock,
  AlertTriangle,
  ExternalLink,
  Eye,
} from "lucide-react";
import { isAdminAuthenticated } from "~/lib/admin-auth";
import { NotifyButton } from "~/components/NotifyModal";
import { getAllClientSlugs, getClient, getClientPassword } from "~/lib/clients";
import { getReportDates, getReport, formatDate } from "~/lib/reports";

type ClientSummary = {
  slug: string;
  name: string;
  logo?: string;
  emails: string[];
  password: string;
  platform: string;
  reportCount: number;
  lastReportDate: string | null;
  daysSinceLastReport: number | null;
};

async function getClientSummaries(): Promise<ClientSummary[]> {
  const slugs = getAllClientSlugs();
  const summaries: ClientSummary[] = [];

  for (const slug of slugs) {
    const client = getClient(slug);
    if (!client) continue;

    const dates = await getReportDates(slug);
    const latestReport = dates[0] ? await getReport(slug, dates[0]) : null;

    let daysSince: number | null = null;
    if (dates[0]) {
      const reportDate = new Date(dates[0]);
      const now = new Date();
      daysSince = Math.floor(
        (now.getTime() - reportDate.getTime()) / (1000 * 60 * 60 * 24),
      );
    }

    summaries.push({
      slug,
      name: client.name,
      logo: client.logo,
      emails: client.emails ?? [],
      password: getClientPassword(slug) ?? "",
      platform: latestReport?.platform ?? "—",
      reportCount: dates.length,
      lastReportDate: dates[0] ?? null,
      daysSinceLastReport: daysSince,
    });
  }

  return summaries;
}

export default async function AdminDashboard() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const clients = await getClientSummaries();
  const totalReports = clients.reduce((sum, c) => sum + c.reportCount, 0);
  const staleClients = clients.filter(
    (c) => c.daysSinceLastReport !== null && c.daysSinceLastReport > 7,
  );

  return (
    <div className="min-h-screen bg-[#0f1115]">
      {/* Header */}
      <div
        className="border-b px-6 py-8 sm:px-10"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="mx-auto max-w-[1100px]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-[#e4e4e7]">
                Admin Dashboard
              </h1>
              <p className="mt-1 text-sm text-[#71717a]">
                DigitalNova Studio
              </p>
            </div>
            <Image
              src="/dn-logo.png"
              alt="DigitalNova Studio"
              width={160}
              height={48}
              unoptimized
              className="h-8 w-auto"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1100px] px-6 py-10 sm:px-10">
        {/* Stats row */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            icon={<FileText className="h-4 w-4" />}
            label="Total Clients"
            value={clients.length.toString()}
          />
          <StatCard
            icon={<FileText className="h-4 w-4" />}
            label="Total Reports"
            value={totalReports.toString()}
          />
          <StatCard
            icon={<AlertTriangle className="h-4 w-4" />}
            label="Need Reports"
            value={staleClients.length.toString()}
            alert={staleClients.length > 0}
          />
          <StatCard
            icon={<Eye className="h-4 w-4" />}
            label="Page Views"
            value="—"
            subtitle="Supabase pending"
          />
        </div>

        {/* Client overview */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-[#e4e4e7]">
            Clients
          </h2>
          <div className="space-y-3">
            {clients.map((client) => (
              <div
                key={client.slug}
                className="flex items-center justify-between rounded-xl p-4 sm:p-5"
                style={{
                  border: "1px solid rgba(255,255,255,0.08)",
                  backgroundColor: "rgba(255,255,255,0.02)",
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
                      className="h-10 w-10 rounded-lg object-contain p-1"
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
                      <span>{client.platform}</span>
                      <span className="hidden sm:inline">·</span>
                      <span>
                        {client.reportCount} report
                        {client.reportCount !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-5">
                  <div className="hidden text-right sm:block">
                    {client.lastReportDate ? (
                      <>
                        <div className="text-sm text-[#e4e4e7]">
                          {formatDate(client.lastReportDate)}
                        </div>
                        <div
                          className={`text-xs ${
                            client.daysSinceLastReport !== null &&
                            client.daysSinceLastReport > 7
                              ? "text-amber-400"
                              : "text-[#71717a]"
                          }`}
                        >
                          {client.daysSinceLastReport === 0
                            ? "Today"
                            : client.daysSinceLastReport === 1
                              ? "1 day ago"
                              : `${client.daysSinceLastReport} days ago`}
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-[#71717a]">No reports</div>
                    )}
                  </div>
                  <NotifyButton
                    client={{
                      slug: client.slug,
                      name: client.name,
                      emails: client.emails,
                      lastReportDate: client.lastReportDate
                        ? formatDate(client.lastReportDate)
                        : null,
                      password: client.password,
                      dashboardUrl: `https://reports.digitalnovastudio.com/${client.slug}`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report freshness */}
        {staleClients.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-[#e4e4e7]">
              Needs Attention
            </h2>
            <div
              className="rounded-xl p-4 sm:p-5"
              style={{
                border: "1px solid rgba(245, 158, 11, 0.2)",
                backgroundColor: "rgba(245, 158, 11, 0.05)",
              }}
            >
              <div className="space-y-2">
                {staleClients.map((client) => (
                  <div
                    key={client.slug}
                    className="flex items-center gap-3 text-sm"
                  >
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
                    <span className="text-[#e4e4e7]">
                      <span className="font-medium">{client.name}</span>
                      <span className="text-[#71717a]">
                        {" "}
                        — last report was{" "}
                        {client.daysSinceLastReport} days ago
                        ({formatDate(client.lastReportDate!)})
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Page views placeholder */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-[#e4e4e7]">
            Recent Activity
          </h2>
          <div
            className="flex items-center justify-center rounded-xl py-12"
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              backgroundColor: "rgba(255,255,255,0.02)",
            }}
          >
            <div className="text-center">
              <Clock className="mx-auto mb-2 h-8 w-8 text-[#52525b]" />
              <p className="text-sm text-[#71717a]">
                Page view tracking will be available once Supabase is connected
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  subtitle,
  alert,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle?: string;
  alert?: boolean;
}) {
  return (
    <div
      className="rounded-xl p-4 sm:p-5"
      style={{
        border: alert
          ? "1px solid rgba(245, 158, 11, 0.2)"
          : "1px solid rgba(255,255,255,0.08)",
        backgroundColor: alert
          ? "rgba(245, 158, 11, 0.05)"
          : "rgba(255,255,255,0.02)",
      }}
    >
      <div className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#71717a]">
        {icon}
        {label}
      </div>
      <div
        className={`text-2xl font-semibold ${alert ? "text-amber-400" : "text-[#e4e4e7]"}`}
      >
        {value}
      </div>
      {subtitle && (
        <div className="mt-0.5 text-xs text-[#52525b]">{subtitle}</div>
      )}
    </div>
  );
}
