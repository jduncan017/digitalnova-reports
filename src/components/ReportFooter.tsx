import Image from "next/image";

export function ReportFooter({ dnLogo = "/dn-logo.png" }: { dnLogo?: string }) {
  return (
    <div
      className="mt-auto w-full py-10"
      style={{
        borderTop: "1px solid var(--border)",
        backgroundColor: "var(--surface-transparent)",
      }}
    >
      <div className="flex flex-col items-center gap-3">
        <Image
          src={dnLogo}
          alt="DigitalNova Studio"
          width={160}
          height={48}
          unoptimized
          className="h-8 w-auto"
        />
      </div>
    </div>
  );
}
