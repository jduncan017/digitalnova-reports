import { notFound, redirect } from "next/navigation";
import { getClient, getDnLogo } from "~/lib/clients";
import { isAuthenticated } from "~/lib/auth";
import { getReport, getReportDates } from "~/lib/reports";
import { ReportHeader } from "~/components/ReportHeader";
import { ReportFooter } from "~/components/ReportFooter";
import { MetricGrid } from "~/components/MetricGrid";
import { FunnelChart } from "~/components/FunnelChart";
import { ChartGrid } from "~/components/ChartGrid";
import { FindingsGrid } from "~/components/FindingsGrid";
import { Timeline } from "~/components/Timeline";
import { NextSteps } from "~/components/NextSteps";
import { SectionHeader } from "~/components/SectionHeader";
import { VideoEmbed } from "~/components/VideoEmbed";
import { ReportFeedback } from "~/components/ReportFeedback";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ client: string; date: string }>;
}) {
  const { client: clientSlug, date } = await params;
  const client = getClient(clientSlug);
  if (!client) notFound();

  if (!(await isAuthenticated(clientSlug))) {
    redirect(`/${clientSlug}/login`);
  }

  const [report, dates] = await Promise.all([
    getReport(clientSlug, date),
    getReportDates(clientSlug),
  ]);
  if (!report) notFound();

  const isMonthly =
    dates.length >= 2 &&
    (new Date(dates[0]!).getTime() - new Date(dates[1]!).getTime()) /
      (1000 * 60 * 60 * 24) >
      20;

  const videoUrl =
    typeof report.videoUrl === "string" && report.videoUrl.length > 0
      ? report.videoUrl
      : null;

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        background:
          "linear-gradient(to bottom right, var(--bg), var(--surface))",
      }}
    >
      <ReportHeader
        report={report}
        clientSlug={clientSlug}
        clientLogo={client.logo}
        dnLogo={getDnLogo(client)}
      />

      <div className="mx-auto max-w-[1100px] px-6 py-20 sm:px-10">
        {videoUrl && (
          <div className="mt-12">
            <SectionHeader label="Video Review" title="Campaign Walkthrough" />
            <VideoEmbed
              url={videoUrl}
              title={`${report.client} — ${report.reportTitle}`}
            />
          </div>
        )}

        {report.summary && (
          <div className="mb-12">
            <SectionHeader
              label="Summary"
              title={isMonthly ? "This Month at a Glance" : "This Week at a Glance"}
            />
            <p
              className="max-w-[720px] text-base leading-relaxed whitespace-pre-line"
              style={{ color: "var(--text-body)" }}
            >
              {report.summary}
            </p>
          </div>
        )}

        <SectionHeader label="Performance Overview" title="Key Metrics" />
        <MetricGrid metrics={report.metrics} />

        {report.funnel && (
          <div className="mt-12">
            <SectionHeader
              label="Funnel Analysis"
              title={`${report.funnel.title}`}
            />
            <FunnelChart funnel={report.funnel} />
          </div>
        )}

        {report.charts.length > 0 && (
          <div className="mt-12">
            <ChartGrid charts={report.charts} />
          </div>
        )}

        {report.findings.length > 0 && (
          <div className="mt-12">
            <SectionHeader
              label="Key Findings"
              title="What the Data Tells Us"
            />
            <FindingsGrid findings={report.findings} />
          </div>
        )}

        {report.actions.length > 0 && (
          <div className="mt-12">
            <SectionHeader label="Actions Taken" title="What We Did" />
            <Timeline actions={report.actions} />
          </div>
        )}

        {report.nextSteps.length > 0 && (
          <div className="mt-12">
            <SectionHeader
              label="Looking Ahead"
              title={isMonthly ? "Coming Up" : "Next Week"}
            />
            <NextSteps steps={report.nextSteps} />
          </div>
        )}
        <div className="mt-12">
          <ReportFeedback
            clientSlug={clientSlug}
            clientName={client.name}
            reportDate={date}
            clientEmails={client.emails ?? []}
            isMonthly={isMonthly}
          />
        </div>
      </div>
      <ReportFooter dnLogo={getDnLogo(client)} />
    </div>
  );
}
