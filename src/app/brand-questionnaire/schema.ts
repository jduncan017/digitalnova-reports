import { z } from "zod";

export const ANALYTICS_OPTIONS = [
  "Google Analytics",
  "Google Search Console",
  "Webmaster Tools",
  "Ahrefs",
  "SemRush",
  "Other",
  "None",
] as const;

const SHORT = 300;
const MED = 2_000;
const LONG = 8_000;

const text = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Must be ${max} chars or fewer`)
    .default("");

// Schema is permissive on required-ness — required is enforced manually
// based on which sections are enabled (so hidden sections don't block submit).
export const questionnaireSchema = z.object({
  respondentName: text(SHORT),
  respondentEmail: z
    .string()
    .trim()
    .max(SHORT)
    .refine((v) => v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
      message: "Invalid email",
    })
    .default(""),
  businessName: text(SHORT),
  businessSummary: text(MED),
  whyExists: text(LONG),
  productsServices: text(LONG),
  partners: text(MED),
  missionTagline: text(MED),
  goals: text(LONG),
  currentCustomers: text(MED),
  customerSituation: text(MED),
  whyChooseYou: text(MED),
  newCustomers: text(MED),
  benefitGroup: text(MED),
  competitorsList: text(MED),
  pricingStrategy: text(MED),
  competitorLikes: text(MED),
  competitorDislikes: text(MED),
  brandPersonality: text(MED),
  industryLanguage: text(MED),
  descriptiveWords: text(SHORT),
  colorPreferences: text(MED),
  favoriteBrands: text(LONG),
  logoTypography: text(MED),
  pinterestBoard: z
    .string()
    .trim()
    .max(SHORT)
    .refine((v) => v === "" || /^https?:\/\//i.test(v), {
      message: "Must be a URL starting with http(s)://",
    })
    .default(""),
  currentMarketing: text(MED),
  futureMarketing: text(MED),
  customerFinding: text(MED),
  marketingTried: text(MED),
  websiteGoal: text(MED),
  websiteDislikes: text(MED),
  accessibility: text(MED),
  gmb: z
    .string()
    .trim()
    .max(50)
    .refine((v) => v === "" || ["Yes", "No", "Not sure"].includes(v), {
      message: "Invalid value",
    })
    .default(""),
  analyticsTracking: z
    .array(z.enum(ANALYTICS_OPTIONS))
    .max(20)
    .default([]),
  analyticsOther: text(SHORT),
  socialPlatforms: text(MED),
  emailMarketing: text(MED),
  marketingBudget: text(SHORT),
  keyDates: text(MED),
  additionalInfo: text(LONG),
  honeypot: z.string().max(0).optional(),
});

export type QuestionnaireData = z.infer<typeof questionnaireSchema>;

export type FieldKey = Exclude<keyof QuestionnaireData, "honeypot">;

export const FIELD_LABELS: Record<FieldKey, string> = {
  respondentName: "Your Name",
  respondentEmail: "Your Email",
  businessName: "Business Name",
  businessSummary: "Business Summary",
  whyExists: "Why does your business exist?",
  productsServices: "Products / Services",
  partners: "Strategic Partners / Allies",
  missionTagline: "Mission Statement / Tagline",
  goals: "Goals (1, 3, 5 years)",
  currentCustomers: "Current Customers",
  customerSituation: "Customer Situation & Problems",
  whyChooseYou: "Why customers choose you",
  newCustomers: "New customers to attract",
  benefitGroup: "Underserved group / barriers",
  competitorsList: "3 Competitors",
  pricingStrategy: "Pricing vs Competitors",
  competitorLikes: "What you like about competitors",
  competitorDislikes: "What you dislike about competitors",
  brandPersonality: "Brand as a person — voice & action",
  industryLanguage: "Industry terms to use / avoid",
  descriptiveWords: "2-6 descriptive words",
  colorPreferences: "Color preferences",
  favoriteBrands: "3 brands whose design you love",
  logoTypography: "Logo & typography examples",
  pinterestBoard: "Pinterest board",
  currentMarketing: "Current marketing",
  futureMarketing: "Future marketing plans",
  customerFinding: "How customers currently find you",
  marketingTried: "Marketing strategies tried",
  websiteGoal: "Primary website goal",
  websiteDislikes: "Current website dislikes",
  accessibility: "Accessibility requirements",
  gmb: "Registered with Google My Business?",
  analyticsTracking: "Analytics tools",
  analyticsOther: "Analytics — Other",
  socialPlatforms: "Important social platforms",
  emailMarketing: "Email marketing",
  marketingBudget: "Marketing budget",
  keyDates: "Key dates / seasonal considerations",
  additionalInfo: "Anything else",
};

// ---- Sections ----

export type SectionId =
  | "welcome"
  | "contact"
  | "business"
  | "audience"
  | "competitors"
  | "brand"
  | "marketing"
  | "website"
  | "seo"
  | "additional";

export type Section = {
  id: SectionId;
  label: string;
  description?: string;
  fields: FieldKey[];
  alwaysOn?: boolean;
};

export const SECTIONS: Section[] = [
  {
    id: "welcome",
    label: "Welcome",
    fields: [],
    alwaysOn: true,
  },
  {
    id: "contact",
    label: "Your Contact Info",
    description: "So I can send you a copy and follow up.",
    fields: ["respondentName", "respondentEmail"],
    alwaysOn: true,
  },
  {
    id: "business",
    label: "Your Business",
    fields: [
      "businessName",
      "businessSummary",
      "whyExists",
      "productsServices",
      "partners",
      "missionTagline",
      "goals",
    ],
  },
  {
    id: "audience",
    label: "Your Audience",
    fields: [
      "currentCustomers",
      "customerSituation",
      "whyChooseYou",
      "newCustomers",
      "benefitGroup",
    ],
  },
  {
    id: "competitors",
    label: "Key Competitors",
    fields: [
      "competitorsList",
      "pricingStrategy",
      "competitorLikes",
      "competitorDislikes",
    ],
  },
  {
    id: "brand",
    label: "Your Brand",
    fields: [
      "brandPersonality",
      "industryLanguage",
      "descriptiveWords",
      "colorPreferences",
      "favoriteBrands",
      "logoTypography",
      "pinterestBoard",
    ],
  },
  {
    id: "marketing",
    label: "Your Marketing",
    fields: [
      "currentMarketing",
      "futureMarketing",
      "customerFinding",
      "marketingTried",
      "socialPlatforms",
      "emailMarketing",
      "marketingBudget",
      "keyDates",
    ],
  },
  {
    id: "website",
    label: "Your Website",
    fields: ["websiteGoal", "websiteDislikes", "accessibility"],
  },
  {
    id: "seo",
    label: "Search Engine Optimization",
    fields: ["gmb", "analyticsTracking", "analyticsOther"],
  },
  {
    id: "additional",
    label: "Almost there!",
    fields: ["additionalInfo"],
  },
];

export const ALL_SECTION_IDS: SectionId[] = SECTIONS.map((s) => s.id);

const REQUIRED_BY_FIELD: Record<FieldKey, boolean> = {
  respondentName: true,
  respondentEmail: true,
  businessName: true,
  businessSummary: true,
  whyExists: true,
  productsServices: true,
  partners: false,
  missionTagline: false,
  goals: true,
  currentCustomers: true,
  customerSituation: true,
  whyChooseYou: true,
  newCustomers: true,
  benefitGroup: false,
  competitorsList: true,
  pricingStrategy: true,
  competitorLikes: true,
  competitorDislikes: true,
  brandPersonality: true,
  industryLanguage: false,
  descriptiveWords: true,
  colorPreferences: true,
  favoriteBrands: true,
  logoTypography: false,
  pinterestBoard: false,
  currentMarketing: true,
  futureMarketing: true,
  customerFinding: true,
  marketingTried: false,
  websiteGoal: true,
  websiteDislikes: false,
  accessibility: false,
  gmb: true,
  analyticsTracking: true,
  analyticsOther: false,
  socialPlatforms: false,
  emailMarketing: true,
  marketingBudget: true,
  keyDates: false,
  additionalInfo: false,
};

export function isFieldRequired(key: FieldKey): boolean {
  return REQUIRED_BY_FIELD[key];
}

export function getSectionById(id: SectionId): Section | undefined {
  return SECTIONS.find((s) => s.id === id);
}

export function parseEnabledSections(raw: string | null | undefined): SectionId[] {
  if (!raw) return ALL_SECTION_IDS;
  const tokens = raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const valid = tokens.filter((t): t is SectionId =>
    ALL_SECTION_IDS.includes(t as SectionId),
  );
  // Always include alwaysOn sections
  const merged = new Set<SectionId>(valid);
  for (const s of SECTIONS) {
    if (s.alwaysOn) merged.add(s.id);
  }
  // Preserve canonical order
  return ALL_SECTION_IDS.filter((id) => merged.has(id));
}

export function getRequiredFieldsForSections(
  enabled: SectionId[],
): FieldKey[] {
  const enabledSet = new Set(enabled);
  const result: FieldKey[] = [];
  for (const section of SECTIONS) {
    if (!enabledSet.has(section.id)) continue;
    for (const field of section.fields) {
      if (REQUIRED_BY_FIELD[field]) result.push(field);
    }
  }
  return result;
}

export function getFieldsForSections(enabled: SectionId[]): FieldKey[] {
  const enabledSet = new Set(enabled);
  const result: FieldKey[] = [];
  for (const section of SECTIONS) {
    if (!enabledSet.has(section.id)) continue;
    for (const field of section.fields) {
      result.push(field);
    }
  }
  return result;
}

export const EMPTY_DATA: QuestionnaireData = {
  respondentName: "",
  respondentEmail: "",
  businessName: "",
  businessSummary: "",
  whyExists: "",
  productsServices: "",
  partners: "",
  missionTagline: "",
  goals: "",
  currentCustomers: "",
  customerSituation: "",
  whyChooseYou: "",
  newCustomers: "",
  benefitGroup: "",
  competitorsList: "",
  pricingStrategy: "",
  competitorLikes: "",
  competitorDislikes: "",
  brandPersonality: "",
  industryLanguage: "",
  descriptiveWords: "",
  colorPreferences: "",
  favoriteBrands: "",
  logoTypography: "",
  pinterestBoard: "",
  currentMarketing: "",
  futureMarketing: "",
  customerFinding: "",
  marketingTried: "",
  websiteGoal: "",
  websiteDislikes: "",
  accessibility: "",
  gmb: "",
  analyticsTracking: [],
  analyticsOther: "",
  socialPlatforms: "",
  emailMarketing: "",
  marketingBudget: "",
  keyDates: "",
  additionalInfo: "",
  honeypot: "",
};
