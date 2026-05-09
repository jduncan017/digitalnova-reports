"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Send, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight, Pencil } from "lucide-react";
import { submitQuestionnaire } from "./submit-action";
import {
  ANALYTICS_OPTIONS,
  EMPTY_DATA,
  FIELD_LABELS,
  SECTIONS,
  getRequiredFieldsForSections,
  isFieldRequired,
  type FieldKey,
  type QuestionnaireData,
  type SectionId,
} from "./schema";

const STORAGE_KEY = "dn-brand-questionnaire-v1";
const SAVE_DEBOUNCE_MS = 600;

function isEmpty(value: QuestionnaireData[FieldKey]): boolean {
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "string") return value.trim().length === 0;
  return value == null;
}

type UpdateFn = <K extends FieldKey>(key: K, value: QuestionnaireData[K]) => void;

const inputStyles =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-[#e4e4e7] placeholder-[#71717a] outline-none transition focus:border-[#a78bfa]/50 focus:ring-2 focus:ring-[#a78bfa]/30";

function Label({
  htmlFor,
  children,
  required,
  hint,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div className="mb-2">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-[#e4e4e7]"
      >
        {children}
        {required && (
          <span aria-label="required" className="ml-1 text-red-400">
            *
          </span>
        )}
      </label>
      {hint && <p className="mt-1 text-xs text-[#71717a]">{hint}</p>}
    </div>
  );
}

// ---- Section render helpers ----

function WelcomeSection() {
  return (
    <div className="space-y-4 text-[#a1a1aa]">
      <p>
        Thank you for taking the time to complete this brand questionnaire.
        Your thoughtful responses will help me create a brand and design that
        authentically represents your business and resonates with your ideal
        customers.
      </p>
      <p>
        This questionnaire typically takes 45-60 minutes to complete. Don&apos;t
        worry though, your responses will be automatically saved in your
        browser, so you can take breaks and come back to continue where you
        left off.
      </p>
      <div>
        <p className="mb-2 text-[#e4e4e7]">
          To get the most out of this process:
        </p>
        <ul className="list-inside list-disc space-y-1">
          <li>Take your time with each question</li>
          <li>Be as specific and honest as possible</li>
        </ul>
      </div>
      <p>
        If you have any questions while completing the form, please feel free
        to reach out to me.
      </p>
      <p>
        I&apos;m excited to learn about your business and help bring your brand
        vision to life!
      </p>
    </div>
  );
}

function ContactSection({
  data,
  update,
}: {
  data: QuestionnaireData;
  update: UpdateFn;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <Label htmlFor="field-respondentName" required>
          Your name
        </Label>
        <input
          id="field-respondentName"
          type="text"
          value={data.respondentName}
          onChange={(e) => update("respondentName", e.target.value)}
          className={inputStyles}
        />
      </div>
      <div>
        <Label htmlFor="field-respondentEmail" required>
          Your email
        </Label>
        <input
          id="field-respondentEmail"
          type="email"
          value={data.respondentEmail}
          onChange={(e) => update("respondentEmail", e.target.value)}
          className={inputStyles}
        />
      </div>
    </div>
  );
}

function BusinessSection({
  data,
  update,
}: {
  data: QuestionnaireData;
  update: UpdateFn;
}) {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="field-businessName" required>
          What is the name of your business?
        </Label>
        <input
          id="field-businessName"
          type="text"
          value={data.businessName}
          onChange={(e) => update("businessName", e.target.value)}
          className={inputStyles}
        />
      </div>
      <div>
        <Label
          htmlFor="field-businessSummary"
          required
          hint="Think about how you'd describe your business to someone at a networking event."
        >
          Give a short summary of your business (1-2 sentences)
        </Label>
        <textarea
          id="field-businessSummary"
          rows={3}
          value={data.businessSummary}
          onChange={(e) => update("businessSummary", e.target.value)}
          className={inputStyles}
        />
      </div>
      <div>
        <Label htmlFor="field-whyExists" required>
          Why does your business exist? What is the story behind it, and what
          are the core values that drive you?
        </Label>
        <textarea
          id="field-whyExists"
          rows={5}
          value={data.whyExists}
          onChange={(e) => update("whyExists", e.target.value)}
          className={inputStyles}
        />
      </div>
      <div>
        <Label
          htmlFor="field-productsServices"
          required
          hint="Think about which ones you want to specifically market on your website."
        >
          What specific products/services do you offer and which are the most
          important to your business?
        </Label>
        <textarea
          id="field-productsServices"
          rows={4}
          value={data.productsServices}
          onChange={(e) => update("productsServices", e.target.value)}
          className={inputStyles}
        />
      </div>
      <div>
        <Label
          htmlFor="field-partners"
          hint="What collaborations would create value for your customers? What partnerships might open doors to new audiences or enhance your credibility?"
        >
          Do you have any strategic partners / allies in the industry? Would
          you like to?
        </Label>
        <textarea
          id="field-partners"
          rows={4}
          value={data.partners}
          onChange={(e) => update("partners", e.target.value)}
          className={inputStyles}
        />
      </div>
      <div>
        <Label htmlFor="field-missionTagline">
          Do you have a mission statement or tagline?
        </Label>
        <textarea
          id="field-missionTagline"
          rows={3}
          value={data.missionTagline}
          onChange={(e) => update("missionTagline", e.target.value)}
          className={inputStyles}
        />
      </div>
      <div>
        <Label htmlFor="field-goals" required>
          What are your goals for your business? 1 year? 3 years? 5 years?
        </Label>
        <textarea
          id="field-goals"
          rows={5}
          value={data.goals}
          onChange={(e) => update("goals", e.target.value)}
          className={inputStyles}
        />
      </div>
    </div>
  );
}

function AudienceSection({
  data,
  update,
}: {
  data: QuestionnaireData;
  update: UpdateFn;
}) {
  return (
    <div className="space-y-6">
      <div>
        <Label
          htmlFor="field-currentCustomers"
          required
          hint="What values, interests, or lifestyle choices unite them?"
        >
          Describe your current customers
        </Label>
        <textarea
          id="field-currentCustomers"
          rows={4}
          value={data.currentCustomers}
          onChange={(e) => update("currentCustomers", e.target.value)}
          className={inputStyles}
        />
      </div>
      <div>
        <Label htmlFor="field-customerSituation" required>
          What is their situation right now? What problems are they facing?
        </Label>
        <textarea
          id="field-customerSituation"
          rows={4}
          value={data.customerSituation}
          onChange={(e) => update("customerSituation", e.target.value)}
          className={inputStyles}
        />
      </div>
      <div>
        <Label
          htmlFor="field-whyChooseYou"
          required
          hint="Think about the last time a customer specifically complimented your business. What exactly did they appreciate?"
        >
          Why do customers choose you? What sets you apart?
        </Label>
        <textarea
          id="field-whyChooseYou"
          rows={4}
          value={data.whyChooseYou}
          onChange={(e) => update("whyChooseYou", e.target.value)}
          className={inputStyles}
        />
      </div>
      <div>
        <Label htmlFor="field-newCustomers" required>
          Are there any new customers you&apos;d like to start attracting? If
          yes, please expand on that.
        </Label>
        <textarea
          id="field-newCustomers"
          rows={4}
          value={data.newCustomers}
          onChange={(e) => update("newCustomers", e.target.value)}
          className={inputStyles}
        />
      </div>
      <div>
        <Label htmlFor="field-benefitGroup">
          Is there a group that would benefit from your offerings but
          doesn&apos;t know about you yet? What&apos;s stopped you from reaching
          them until now?
        </Label>
        <textarea
          id="field-benefitGroup"
          rows={4}
          value={data.benefitGroup}
          onChange={(e) => update("benefitGroup", e.target.value)}
          className={inputStyles}
        />
      </div>
    </div>
  );
}

function CompetitorsSection({
  data,
  update,
}: {
  data: QuestionnaireData;
  update: UpdateFn;
}) {
  return (
    <div className="space-y-6">
      <div>
        <Label
          htmlFor="field-competitorsList"
          required
          hint="Please provide their names, websites, and/or social media. Consider whether you're trying to target a local or national customer base and who you're competing with on that scale."
        >
          List 3 competitors to watch in your industry
        </Label>
        <textarea
          id="field-competitorsList"
          rows={5}
          value={data.competitorsList}
          onChange={(e) => update("competitorsList", e.target.value)}
          className={inputStyles}
        />
      </div>
      <div>
        <Label htmlFor="field-pricingStrategy" required>
          How does your pricing strategy compare to your competitors?
        </Label>
        <textarea
          id="field-pricingStrategy"
          rows={3}
          value={data.pricingStrategy}
          onChange={(e) => update("pricingStrategy", e.target.value)}
          className={inputStyles}
        />
      </div>
      <div>
        <Label htmlFor="field-competitorLikes" required>
          What do you like or admire about these competitors?
        </Label>
        <textarea
          id="field-competitorLikes"
          rows={3}
          value={data.competitorLikes}
          onChange={(e) => update("competitorLikes", e.target.value)}
          className={inputStyles}
        />
      </div>
      <div>
        <Label htmlFor="field-competitorDislikes" required>
          What do you dislike about them?
        </Label>
        <textarea
          id="field-competitorDislikes"
          rows={3}
          value={data.competitorDislikes}
          onChange={(e) => update("competitorDislikes", e.target.value)}
          className={inputStyles}
        />
      </div>
    </div>
  );
}

function BrandSection({
  data,
  update,
}: {
  data: QuestionnaireData;
  update: UpdateFn;
}) {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="field-brandPersonality" required>
          If your brand were a person, how would it speak & act?
        </Label>
        <textarea
          id="field-brandPersonality"
          rows={4}
          value={data.brandPersonality}
          onChange={(e) => update("brandPersonality", e.target.value)}
          className={inputStyles}
        />
      </div>
      <div>
        <Label htmlFor="field-industryLanguage">
          Are there any specific industry terms or language you want to use or
          avoid?
        </Label>
        <textarea
          id="field-industryLanguage"
          rows={3}
          value={data.industryLanguage}
          onChange={(e) => update("industryLanguage", e.target.value)}
          className={inputStyles}
        />
      </div>
      <div>
        <Label
          htmlFor="field-descriptiveWords"
          required
          hint="If your closest customers were describing your business to a friend, what words would you hope they'd use? What qualities would make you proud?"
        >
          Are there 2-6 descriptive words that you feel describe how you want
          your customers to perceive your business?
        </Label>
        <textarea
          id="field-descriptiveWords"
          rows={3}
          value={data.descriptiveWords}
          onChange={(e) => update("descriptiveWords", e.target.value)}
          className={inputStyles}
        />
      </div>
      <div>
        <Label
          htmlFor="field-colorPreferences"
          required
          hint="This can also be your current brand colors."
        >
          Do you have any color preferences for your brand? Are there any
          colors you would like to stay away from?
        </Label>
        <textarea
          id="field-colorPreferences"
          rows={3}
          value={data.colorPreferences}
          onChange={(e) => update("colorPreferences", e.target.value)}
          className={inputStyles}
        />
      </div>
      <div>
        <Label
          htmlFor="field-favoriteBrands"
          required
          hint="Think beyond your industry. What brands resonate with you personally?"
        >
          What are 3 specific brands whose designs you love? What specifically
          do you like about each of them?
        </Label>
        <textarea
          id="field-favoriteBrands"
          rows={5}
          value={data.favoriteBrands}
          onChange={(e) => update("favoriteBrands", e.target.value)}
          className={inputStyles}
        />
      </div>
      <div>
        <Label htmlFor="field-logoTypography" hint="Optional, but helpful!">
          Please give a few examples of logos and typography that you believe
          are in line with your brand and describe why. (If you don&apos;t have
          any in mind, Pinterest is an excellent place to start!)
        </Label>
        <textarea
          id="field-logoTypography"
          rows={4}
          value={data.logoTypography}
          onChange={(e) => update("logoTypography", e.target.value)}
          className={inputStyles}
        />
      </div>
      <div>
        <Label htmlFor="field-pinterestBoard" hint="Optional">
          Do you have a Pinterest board for your business? If so, you can leave
          a link here:
        </Label>
        <input
          id="field-pinterestBoard"
          type="url"
          value={data.pinterestBoard}
          onChange={(e) => update("pinterestBoard", e.target.value)}
          className={inputStyles}
          placeholder="https://"
        />
      </div>
    </div>
  );
}

function MarketingSection({
  data,
  update,
}: {
  data: QuestionnaireData;
  update: UpdateFn;
}) {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="field-currentMarketing" required>
          How are you currently marketing your business?
        </Label>
        <textarea
          id="field-currentMarketing"
          rows={4}
          value={data.currentMarketing}
          onChange={(e) => update("currentMarketing", e.target.value)}
          className={inputStyles}
        />
      </div>
      <div>
        <Label
          htmlFor="field-futureMarketing"
          required
          hint="If I'm providing marketing services, don't worry! I'll be helping you with this but it helps to know what ideas you have / are open to."
        >
          How do you plan to market your business in the future?
        </Label>
        <textarea
          id="field-futureMarketing"
          rows={4}
          value={data.futureMarketing}
          onChange={(e) => update("futureMarketing", e.target.value)}
          className={inputStyles}
        />
      </div>
      <div>
        <Label
          htmlFor="field-customerFinding"
          required
          hint="Consider tracing back your last 5-10 new customers. How did they discover you? Was there a pattern that surprised you?"
        >
          How are your customers currently finding you? Social media?
          Referrals? Ads?
        </Label>
        <textarea
          id="field-customerFinding"
          rows={4}
          value={data.customerFinding}
          onChange={(e) => update("customerFinding", e.target.value)}
          className={inputStyles}
        />
      </div>
      <div>
        <Label htmlFor="field-marketingTried">
          Are there any marketing strategies that you&apos;ve tried? What was
          successful or unsuccessful? Why do you think they succeeded or
          failed?
        </Label>
        <textarea
          id="field-marketingTried"
          rows={4}
          value={data.marketingTried}
          onChange={(e) => update("marketingTried", e.target.value)}
          className={inputStyles}
        />
      </div>
      <div>
        <Label
          htmlFor="field-socialPlatforms"
          hint="If none, which ones would you consider using?"
        >
          What social media platforms are most important to your business?
        </Label>
        <textarea
          id="field-socialPlatforms"
          rows={3}
          value={data.socialPlatforms}
          onChange={(e) => update("socialPlatforms", e.target.value)}
          className={inputStyles}
        />
      </div>
      <div>
        <Label htmlFor="field-emailMarketing" required>
          Do you currently use email marketing?
        </Label>
        <textarea
          id="field-emailMarketing"
          rows={3}
          value={data.emailMarketing}
          onChange={(e) => update("emailMarketing", e.target.value)}
          className={inputStyles}
          placeholder="Yes / No — and which platform if yes"
        />
      </div>
      <div>
        <Label htmlFor="field-marketingBudget" required>
          What is your marketing budget (monthly/annually)?
        </Label>
        <input
          id="field-marketingBudget"
          type="text"
          value={data.marketingBudget}
          onChange={(e) => update("marketingBudget", e.target.value)}
          className={inputStyles}
        />
      </div>
      <div>
        <Label htmlFor="field-keyDates" hint="Optional">
          Are there any key dates or seasonal considerations for your business?
        </Label>
        <textarea
          id="field-keyDates"
          rows={3}
          value={data.keyDates}
          onChange={(e) => update("keyDates", e.target.value)}
          className={inputStyles}
        />
      </div>
    </div>
  );
}

function WebsiteSection({
  data,
  update,
}: {
  data: QuestionnaireData;
  update: UpdateFn;
}) {
  return (
    <div className="space-y-6">
      <div>
        <Label
          htmlFor="field-websiteGoal"
          required
          hint="Examples: Contact form inquiries, direct bookings, informational landing page, etc."
        >
          What is the primary goal of your website?
        </Label>
        <textarea
          id="field-websiteGoal"
          rows={3}
          value={data.websiteGoal}
          onChange={(e) => update("websiteGoal", e.target.value)}
          className={inputStyles}
        />
      </div>
      <div>
        <Label
          htmlFor="field-websiteDislikes"
          hint="When was the last time you navigated your own website from a customer's perspective? What friction points or missed opportunities did you notice?"
        >
          What don&apos;t you like about your current website? (skip if you
          don&apos;t have one)
        </Label>
        <textarea
          id="field-websiteDislikes"
          rows={4}
          value={data.websiteDislikes}
          onChange={(e) => update("websiteDislikes", e.target.value)}
          className={inputStyles}
        />
      </div>
      <div>
        <Label htmlFor="field-accessibility" hint="Optional">
          Do you have any specific accessibility requirements for your website?
        </Label>
        <textarea
          id="field-accessibility"
          rows={3}
          value={data.accessibility}
          onChange={(e) => update("accessibility", e.target.value)}
          className={inputStyles}
        />
      </div>
    </div>
  );
}

function SeoSection({
  data,
  update,
  toggleAnalytics,
}: {
  data: QuestionnaireData;
  update: UpdateFn;
  toggleAnalytics: (opt: (typeof ANALYTICS_OPTIONS)[number]) => void;
}) {
  return (
    <div className="space-y-6">
      <div id="field-gmb">
        <Label required>
          Is your business registered under &quot;Google My Business&quot;?
        </Label>
        <div className="flex flex-wrap gap-3">
          {(["Yes", "No", "Not sure"] as const).map((opt) => {
            const checked = data.gmb === opt;
            return (
              <label
                key={opt}
                className={`group relative cursor-pointer rounded-lg border px-4 py-2 text-sm transition focus-within:ring-2 focus-within:ring-[#a78bfa]/40 ${
                  checked
                    ? "border-[#a78bfa] bg-[#a78bfa]/15 text-[#e4e4e7]"
                    : "border-white/10 bg-white/[0.03] text-[#d4d4d8] hover:border-white/20"
                }`}
              >
                <input
                  type="radio"
                  name="gmb"
                  value={opt}
                  checked={checked}
                  onChange={() => update("gmb", opt)}
                  className="sr-only"
                />
                {opt}
              </label>
            );
          })}
        </div>
      </div>

      <div id="field-analyticsTracking">
        <Label required hint="Select all that apply">
          Are you currently tracking site analytics? What are you using?
        </Label>
        <div className="grid gap-2 sm:grid-cols-2">
          {ANALYTICS_OPTIONS.map((opt) => {
            const checked = data.analyticsTracking.includes(opt);
            return (
              <label
                key={opt}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-2.5 text-sm transition focus-within:ring-2 focus-within:ring-[#a78bfa]/40 ${
                  checked
                    ? "border-[#a78bfa] bg-[#a78bfa]/10 text-[#e4e4e7]"
                    : "border-white/10 bg-white/[0.03] text-[#d4d4d8] hover:border-white/20"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleAnalytics(opt)}
                  className="h-4 w-4 accent-[#a78bfa]"
                />
                {opt}
              </label>
            );
          })}
        </div>
        {data.analyticsTracking.includes("Other") && (
          <input
            type="text"
            value={data.analyticsOther}
            onChange={(e) => update("analyticsOther", e.target.value)}
            placeholder="Which other tool?"
            className={`mt-3 ${inputStyles}`}
          />
        )}
      </div>
    </div>
  );
}

function AdditionalSection({
  data,
  update,
}: {
  data: QuestionnaireData;
  update: UpdateFn;
}) {
  return (
    <div>
      <Label htmlFor="field-additionalInfo">
        Is there anything else you&apos;d like me to know before we start?
      </Label>
      <textarea
        id="field-additionalInfo"
        rows={5}
        value={data.additionalInfo}
        onChange={(e) => update("additionalInfo", e.target.value)}
        className={inputStyles}
      />
    </div>
  );
}

function formatReviewValue(value: string | string[]): string | null {
  if (Array.isArray(value)) {
    if (value.length === 0) return null;
    return value.join(", ");
  }
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

function ReviewStep({
  data,
  sections,
  onEdit,
}: {
  data: QuestionnaireData;
  sections: { id: SectionId; label: string; fields: FieldKey[] }[];
  onEdit: (sectionId: SectionId) => void;
}) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-[#a1a1aa]">
        Please review your answers below. Click <strong>Edit</strong> on any
        section to make changes, then come back here to submit.
      </p>
      {sections
        .filter((s) => s.fields.length > 0)
        .map((section) => {
          const filled = section.fields
            .map((f) => ({
              field: f,
              value: formatReviewValue(data[f] as string | string[]),
            }))
            .filter((row) => row.value !== null);
          return (
            <div
              key={section.id}
              className="rounded-xl border border-white/10 bg-white/[0.02] p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-semibold text-[#e4e4e7]">
                  {section.label}
                </h3>
                <button
                  type="button"
                  onClick={() => onEdit(section.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-[#d4d4d8] transition hover:border-white/20"
                >
                  <Pencil className="h-3 w-3" />
                  Edit
                </button>
              </div>
              {filled.length === 0 ? (
                <p className="text-sm text-[#71717a]">No answers yet.</p>
              ) : (
                <div className="space-y-3">
                  {filled.map(({ field, value }) => (
                    <div key={field}>
                      <div className="text-xs uppercase tracking-wider text-[#71717a]">
                        {FIELD_LABELS[field]}
                      </div>
                      <div className="mt-0.5 whitespace-pre-wrap text-sm text-[#e4e4e7]">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}

// ---- Main form ----

type SaveState = "idle" | "saving" | "saved";

export function QuestionnaireForm({
  enabledSections,
}: {
  enabledSections: SectionId[];
}) {
  const [data, setData] = useState<QuestionnaireData>(EMPTY_DATA);
  const [hydrated, setHydrated] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showStepErrors, setShowStepErrors] = useState(false);
  const saveTimer = useRef<NodeJS.Timeout | null>(null);

  const sectionsToRender = useMemo(
    () => SECTIONS.filter((s) => enabledSections.includes(s.id)),
    [enabledSections],
  );

  // Total steps = sections + 1 synthetic review step at the end
  const totalSteps = sectionsToRender.length + 1;
  const isReviewStep = step === sectionsToRender.length;
  const currentSection = isReviewStep ? null : sectionsToRender[step];
  const isFirstStep = step === 0;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<QuestionnaireData>;
        setData({ ...EMPTY_DATA, ...parsed });
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    setSaveState("saving");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setSaveState("saved");
      } catch {
        setSaveState("idle");
      }
    }, SAVE_DEBOUNCE_MS);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [data, hydrated]);

  useEffect(() => {
    if (!hydrated || status === "sent") return;
    const dirty = Object.values(data).some((v) =>
      Array.isArray(v) ? v.length > 0 : typeof v === "string" && v.length > 0,
    );
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [data, hydrated, status]);

  const allRequired = useMemo(
    () => getRequiredFieldsForSections(enabledSections),
    [enabledSections],
  );

  const totalCompleted = allRequired.filter((k) => !isEmpty(data[k])).length;
  const totalPercent = Math.round(
    (totalCompleted / Math.max(allRequired.length, 1)) * 100,
  );

  const stepErrors = useMemo<{ field: FieldKey; message: string }[]>(() => {
    if (!currentSection) return [];
    const errors: { field: FieldKey; message: string }[] = [];
    for (const f of currentSection.fields) {
      if (isFieldRequired(f) && isEmpty(data[f])) {
        errors.push({ field: f, message: "This field is required" });
      }
    }
    // Format checks (run only when value present, so don't double-up with required)
    if (
      currentSection.id === "contact" &&
      data.respondentEmail.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.respondentEmail.trim())
    ) {
      errors.push({
        field: "respondentEmail",
        message: "Please enter a valid email address",
      });
    }
    if (
      currentSection.id === "brand" &&
      data.pinterestBoard.trim() &&
      !/^https?:\/\//i.test(data.pinterestBoard.trim())
    ) {
      errors.push({
        field: "pinterestBoard",
        message: "Must start with http:// or https://",
      });
    }
    return errors;
  }, [currentSection, data]);

  const update: UpdateFn = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleAnalytics = (option: (typeof ANALYTICS_OPTIONS)[number]) => {
    setData((prev) => {
      const exists = prev.analyticsTracking.includes(option);
      let next = exists
        ? prev.analyticsTracking.filter((o) => o !== option)
        : [...prev.analyticsTracking, option];
      if (option === "None" && !exists) {
        next = ["None"];
      } else if (option !== "None" && next.includes("None")) {
        next = next.filter((o) => o !== "None");
      }
      return { ...prev, analyticsTracking: next };
    });
  };

  function focusFirstMissing(keys: FieldKey[]) {
    const first = keys[0];
    if (!first) return;
    const el = document.getElementById(`field-${first}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    (el as HTMLInputElement | HTMLTextAreaElement | null)?.focus?.();
  }

  function goNext() {
    if (stepErrors.length > 0) {
      setShowStepErrors(true);
      focusFirstMissing(stepErrors.map((e) => e.field));
      return;
    }
    setShowStepErrors(false);
    setStep((s) => Math.min(s + 1, totalSteps - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goToSection(sectionId: SectionId) {
    const idx = sectionsToRender.findIndex((s) => s.id === sectionId);
    if (idx >= 0) {
      setShowStepErrors(false);
      setStep(idx);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function goPrev() {
    setShowStepErrors(false);
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Form's onSubmit only fires from Enter key in single-line inputs since
  // the Submit button is type="button". Always treat as Next so wizard
  // isn't bypassed.
  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isReviewStep) {
      goNext();
    }
  }

  async function performSubmit() {
    setShowStepErrors(false);
    setErrorMsg(null);

    // Final guard: any required across all enabled sections still missing?
    const allMissing = allRequired.filter((k) => isEmpty(data[k]));
    if (allMissing.length > 0) {
      const idx = sectionsToRender.findIndex((s) =>
        s.fields.some((f) => allMissing.includes(f)),
      );
      if (idx >= 0) setStep(idx);
      setShowStepErrors(true);
      return;
    }

    setStatus("sending");
    const result = await submitQuestionnaire(data, enabledSections);

    if (result.success) {
      setStatus("sent");
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? "Something went wrong. Please try again.");
    }
  }

  function clearForm() {
    if (
      typeof window !== "undefined" &&
      !window.confirm("Clear all answers? This cannot be undone.")
    ) {
      return;
    }
    setData(EMPTY_DATA);
    setStep(0);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  if (status === "sent") {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-emerald-400" />
        <h2 className="mb-2 text-2xl font-semibold text-[#e4e4e7]">
          Thank you!
        </h2>
        <p className="text-[#a1a1aa]">
          Your responses have been sent. A copy is on its way to your inbox.
          I&apos;ll review everything and follow up with next steps shortly.
        </p>
      </div>
    );
  }

  if (!isReviewStep && !currentSection) {
    return (
      <div className="rounded-xl border border-red-400/30 bg-red-400/5 p-4 text-sm text-red-300">
        No sections enabled. Please contact us — this form was misconfigured.
      </div>
    );
  }

  return (
    <>
      {/* Sticky progress */}
      <div
        className="sticky top-0 z-20 -mx-6 mb-10 border-b border-white/10 bg-[#0f1115]/90 px-6 py-3 backdrop-blur"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center justify-between text-xs text-[#a1a1aa]">
          <span>
            {isReviewStep
              ? "Review your answers"
              : `Step ${step + 1} of ${totalSteps} · ${totalCompleted} of ${allRequired.length} required answered`}
          </span>
          <span>
            {saveState === "saving" && "Saving…"}
            {saveState === "saved" && "Saved"}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full bg-[#a78bfa] transition-all duration-300"
            style={{ width: `${totalPercent}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleFormSubmit} noValidate className="space-y-10">
        {/* Honeypot */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "-9999px",
            width: "1px",
            height: "1px",
            overflow: "hidden",
          }}
        >
          <label>
            Leave this field blank
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={data.honeypot ?? ""}
              onChange={(e) =>
                setData((prev) => ({ ...prev, honeypot: e.target.value }))
              }
            />
          </label>
        </div>

        {/* Section heading */}
        <div className="border-b border-white/10 pb-4">
          <h2 className="text-2xl font-semibold tracking-tight text-[#e4e4e7] sm:text-3xl">
            {isReviewStep
              ? "Review & Submit"
              : currentSection?.id === "welcome"
                ? "Welcome to Your Brand Strategy Questionnaire"
                : currentSection?.label}
          </h2>
          {!isReviewStep && currentSection?.description && (
            <p className="mt-1 text-sm text-[#a1a1aa]">
              {currentSection.description}
            </p>
          )}
        </div>

        {/* Section body */}
        <div>
          {isReviewStep && (
            <ReviewStep
              data={data}
              sections={sectionsToRender}
              onEdit={goToSection}
            />
          )}
          {currentSection?.id === "welcome" && <WelcomeSection />}
          {currentSection?.id === "contact" && (
            <ContactSection data={data} update={update} />
          )}
          {currentSection?.id === "business" && (
            <BusinessSection data={data} update={update} />
          )}
          {currentSection?.id === "audience" && (
            <AudienceSection data={data} update={update} />
          )}
          {currentSection?.id === "competitors" && (
            <CompetitorsSection data={data} update={update} />
          )}
          {currentSection?.id === "brand" && (
            <BrandSection data={data} update={update} />
          )}
          {currentSection?.id === "marketing" && (
            <MarketingSection data={data} update={update} />
          )}
          {currentSection?.id === "website" && (
            <WebsiteSection data={data} update={update} />
          )}
          {currentSection?.id === "seo" && (
            <SeoSection
              data={data}
              update={update}
              toggleAnalytics={toggleAnalytics}
            />
          )}
          {currentSection?.id === "additional" && (
            <AdditionalSection data={data} update={update} />
          )}
        </div>

        {/* Validation summary */}
        {showStepErrors && stepErrors.length > 0 && (
          <div
            role="alert"
            className="rounded-xl border border-red-400/30 bg-red-400/5 p-4"
          >
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-red-300">
              <AlertCircle className="h-4 w-4" />
              {stepErrors.length}{" "}
              {stepErrors.length === 1 ? "issue" : "issues"} to fix in this
              section
            </div>
            <ul className="list-disc space-y-1 pl-5 text-sm text-[#d4d4d8]">
              {stepErrors.map((err) => (
                <li key={`${err.field}-${err.message}`}>
                  <a
                    href={`#field-${err.field}`}
                    className="text-[#a78bfa] hover:underline"
                  >
                    {FIELD_LABELS[err.field]}
                  </a>
                  <span className="text-[#a1a1aa]"> — {err.message}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Nav buttons */}
        <div className="flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={goPrev}
              disabled={isFirstStep || status === "sending"}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-[#e4e4e7] transition hover:border-white/20 hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            {!isReviewStep && currentSection?.id !== "welcome" && (
              <button
                type="button"
                onClick={clearForm}
                className="text-xs text-[#71717a] underline-offset-2 hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          {isReviewStep ? (
            <button
              key="submit-btn"
              type="button"
              onClick={performSubmit}
              disabled={status === "sending"}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#a78bfa] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#a78bfa]/30 transition hover:bg-[#8b6df0] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {status === "sending" ? "Sending..." : "Submit questionnaire"}
            </button>
          ) : (
            <button
              key="next-btn"
              type="button"
              onClick={goNext}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#a78bfa] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#a78bfa]/30 transition hover:bg-[#8b6df0]"
            >
              {step === sectionsToRender.length - 1 ? "Review" : "Next"}
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {status === "error" && (
          <p className="text-sm text-red-400">
            {errorMsg ?? "Something went wrong. Please try again."}
          </p>
        )}
      </form>
    </>
  );
}
