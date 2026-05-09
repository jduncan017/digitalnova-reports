import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Image from "next/image";
import { isAdminAuthenticated } from "~/lib/admin-auth";
import { Builder } from "./Builder";

export default async function BrandQuestionnaireBuilderPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const h = await headers();
  const host = h.get("host") ?? "reports.digitalnovastudio.com";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const baseUrl = `${proto}://${host}`;

  return (
    <div className="min-h-screen bg-[#0f1115]">
      <div
        className="border-b px-6 py-8 sm:px-10"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="mx-auto max-w-[800px]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-[#e4e4e7]">
                Questionnaire Builder
              </h1>
              <p className="mt-1 text-sm text-[#71717a]">
                Pick which sections to include and copy the URL.
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

      <div className="mx-auto max-w-[800px] px-6 py-10 sm:px-10">
        <Builder baseUrl={baseUrl} />
      </div>
    </div>
  );
}
