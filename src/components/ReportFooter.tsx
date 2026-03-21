import Image from "next/image";

export function ReportFooter() {
  return (
    <div
      className="mt-auto w-full bg-stone-950/50 py-10"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <div className="flex flex-col items-center gap-3">
        <Image
          src="/dn-logo.png"
          alt="DigitalNova Studio"
          width={160}
          height={48}
          unoptimized
          className="h-8 w-auto"
        />
        <p className="text-sm" style={{ color: "var(--text-faint)" }}>
          Confidential — prepared for client use only
        </p>
      </div>
    </div>
  );
}
