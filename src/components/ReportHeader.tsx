import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { type Report } from "~/lib/types";

export function ReportHeader({
  report,
  clientSlug,
  clientLogo,
  dnLogo,
}: {
  report: Report;
  clientSlug: string;
  clientLogo?: string;
  dnLogo: string;
}) {
  return (
    <div
      className="header-shadow px-6 py-10 sm:px-10 sm:py-14"
      style={{
        background:
          "linear-gradient(to bottom right, color-mix(in srgb, var(--primary) 20%, transparent), var(--surface))",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="mx-auto max-w-[1100px]">
        {/* Nav bar */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href={`/${clientSlug}`}
            className="flex items-center gap-2 text-[15px] transition hover:opacity-80"
            style={{ color: "var(--text-muted)" }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <Image
            src={dnLogo}
            alt="DigitalNova Studio"
            width={200}
            height={60}
            unoptimized
            className="h-9 w-auto"
          />
        </div>

        {/* Client + title */}
        <div className="flex items-start gap-5">
          {clientLogo && (
            <Image
              src={clientLogo}
              alt={report.client}
              width={80}
              height={80}
              unoptimized
              className="mt-1 h-20 w-20 rounded-xl object-contain p-2"
              style={{
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg)",
              }}
            />
          )}
          <div>
            <h1
              className="mb-1.5 text-2xl font-semibold tracking-tight sm:text-[32px] sm:leading-tight"
              style={{ color: "var(--text-heading)" }}
            >
              {report.reportTitle}
            </h1>
            <div className="text-base" style={{ color: "var(--text-body)" }}>
              {report.reportSubtitle}
            </div>
            <div
              className="mt-2.5 flex items-center gap-3 text-[15px]"
              style={{ color: "var(--text-muted)" }}
            >
              <span>{report.period}</span>
              <span style={{ color: "var(--border)" }}>|</span>
              <span
                className="rounded-full px-2.5 py-0.5 text-sm font-medium"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--primary) 15%, transparent)",
                  color: "var(--primary)",
                }}
              >
                {report.platform}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
