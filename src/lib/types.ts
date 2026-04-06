export type MetricStatus = "good" | "bad" | "neutral" | "warning";

export type Metric = {
  label: string;
  value: string;
  note: string;
  status: MetricStatus;
};

export type FunnelStep = {
  label: string;
  count: number | string;
  pct: number | string;
  note?: string;
};

export type FunnelPath = {
  name: string;
  steps: FunnelStep[];
};

export type Funnel = {
  title: string;
  source: string;
  steps?: FunnelStep[];
  paths?: FunnelPath[];
  notes?: string;
};

export type ChartData = {
  id: string;
  type: "bar" | "horizontal-bar" | "pie" | "doughnut" | "line" | "table";
  title: string;
  width?: "full" | "half";
  data: {
    labels?: string[];
    values?: number[];
    headers?: string[];
    rows?: string[][];
    note?: string;
  };
};

export type Finding = {
  title: string;
  description: string;
};

export type Action = {
  title: string;
  description: string;
  status: "done" | "pending";
};

export type TrendChartConfig = {
  key: string;
  title: string;
  subtitle?: string;
  format: "number" | "dollar" | "dollar2" | "percent";
};

export type GrowthTrajectory = {
  currentPhase: string;
  currentMarker: string;
  caption: string;
};

export type RecommendationChange = {
  title: string;
  description: string;
  impact: string;
};

export type ProposedCampaign = {
  name: string;
  daily: string;
  note: string;
};

export type Recommendation = {
  title: string;
  context: string;
  changes: RecommendationChange[];
  proposedBudget?: {
    total: string;
    campaigns: ProposedCampaign[];
  };
  timeline?: string;
  whatWeNeed?: string[];
};

export type Report = {
  client: string;
  reportTitle: string;
  reportSubtitle: string;
  period: string;
  date: string;
  platform: string;
  summary?: string;
  kpis?: Record<string, number>;
  metrics: Metric[];
  funnel?: Funnel;
  charts: ChartData[];
  findings: Finding[];
  actions: Action[];
  nextSteps: string[];
  videoUrl?: string;
  growthTrajectory?: GrowthTrajectory;
  recommendation?: Recommendation;
};
