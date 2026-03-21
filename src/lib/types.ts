export type MetricStatus = "good" | "bad" | "neutral";

export type Metric = {
  label: string;
  value: string;
  note: string;
  status: MetricStatus;
};

export type FunnelStep = {
  label: string;
  count: number;
  pct: number;
};

export type Funnel = {
  title: string;
  source: string;
  steps: FunnelStep[];
  notes: string;
};

export type ChartData = {
  id: string;
  type: "bar" | "doughnut" | "line";
  title: string;
  data: {
    labels: string[];
    values: number[];
  };
};

export type Finding = {
  icon: string;
  title: string;
  description: string;
  highlight: boolean;
};

export type Action = {
  title: string;
  description: string;
  status: "done" | "pending";
};

export type Report = {
  client: string;
  clientLogo?: string;
  reportTitle: string;
  reportSubtitle: string;
  period: string;
  date: string;
  platform: string;
  summary?: string;
  metrics: Metric[];
  funnel?: Funnel;
  charts: ChartData[];
  findings: Finding[];
  actions: Action[];
  nextSteps: string[];
  videoUrl?: string;
};
