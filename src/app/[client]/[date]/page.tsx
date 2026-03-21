import { notFound, redirect } from "next/navigation";
import { getClient } from "~/lib/clients";
import { isAuthenticated } from "~/lib/auth";
import { getReport } from "~/lib/reports";
import { ReportHeader } from "~/components/ReportHeader";
import { ReportFooter } from "~/components/ReportFooter";
import { MetricGrid } from "~/components/MetricGrid";
import { FunnelChart } from "~/components/FunnelChart";
import { ChartGrid } from "~/components/ChartGrid";
import { FindingsGrid } from "~/components/FindingsGrid";
import { Timeline } from "~/components/Timeline";
import { NextSteps } from "~/components/NextSteps";
import { SectionHeader } from "~/components/SectionHeader";

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

  const report = await getReport(clientSlug, date);
  if (!report) notFound();

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <ReportHeader
        report={report}
        clientSlug={clientSlug}
        clientLogo={client.logo}
      />
      <div className="mx-auto max-w-[1100px] px-6 py-12 sm:px-10">
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
            <SectionHeader label="Data" title="Charts & Breakdowns" />
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
            <SectionHeader label="Actions Taken" title="Optimizations" />
            <Timeline actions={report.actions} />
          </div>
        )}

        {report.nextSteps.length > 0 && (
          <div className="mt-12">
            <SectionHeader label="Looking Ahead" title="Next Week" />
            <NextSteps steps={report.nextSteps} />
          </div>
        )}
      </div>
      <ReportFooter />
    </div>
  );
}
