import Image from "next/image";
import type { Metadata } from "next";
import { QuestionnaireForm } from "./QuestionnaireForm";
import { parseEnabledSections } from "./schema";

export const metadata: Metadata = {
  title: "Brand Strategy Questionnaire — DigitalNova Studio",
  description:
    "Help us shape a brand and design that authentically represents your business.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function BrandQuestionnairePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const raw = params.sections;
  const sectionsParam = Array.isArray(raw) ? raw[0] : raw;
  const enabledSections = parseEnabledSections(sectionsParam ?? null);

  return (
    <div className="min-h-screen bg-[#0f1115]">
      <header className="border-b border-white/5">
        <div className="mx-auto flex max-w-3xl items-center px-6 py-6">
          <Image
            src="/dn-logo.png"
            alt="DigitalNova Studio"
            width={200}
            height={60}
            unoptimized
            className="h-9 w-auto"
          />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <QuestionnaireForm enabledSections={enabledSections} />
      </main>

      <footer className="border-t border-white/5 py-8">
        <div className="mx-auto max-w-3xl px-6 text-center text-xs text-[#52525b]">
          DigitalNova Studio
        </div>
      </footer>
    </div>
  );
}
