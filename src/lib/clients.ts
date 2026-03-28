export type ClientBrand = {
  background: string;
  surface: string;
  primary: string;
  dark: boolean;
};

import { type TrendChartConfig } from "./types";

export type ClientConfig = {
  slug: string;
  name: string;
  logo?: string;
  emails?: string[];
  splash?: string;
  brand: ClientBrand;
  trendCharts: TrendChartConfig[];
};

const clients: Record<string, ClientConfig> = {
  finalbit: {
    slug: "finalbit",
    name: "FinalBit",
    logo: "/logos/finalbit.png",
    emails: ["anna@finalbitai.com", "khachatur@finalbitai.com"],
    splash: "/splash-images/finalbit.webp",
    brand: {
      background: "#191b1f",
      surface: "#0c0a09",
      primary: "#1d6ee3",
      dark: true,
    },
    trendCharts: [
      {
        key: "reach",
        title: "Reach",
        subtitle: "Unique people who saw the ad",
        format: "number",
      },
      {
        key: "clicks",
        title: "Clicks",
        subtitle: "Link clicks from ad to landing page",
        format: "number",
      },
      {
        key: "demosBooked",
        title: "Demos Booked",
        subtitle: "Completed demo bookings",
        format: "number",
      },
      {
        key: "cpl",
        title: "Cost per Lead",
        subtitle: "Ad spend per demo booking",
        format: "dollar2",
      },
    ],
  },
  eventcombo: {
    slug: "eventcombo",
    name: "Eventcombo",
    logo: "/logos/eventcombo.png",
    emails: ["saroosh@eventcombo.com"],
    splash: "/splash-images/eventcombo.webp",
    brand: {
      background: "#fff",
      surface: "#FFF0ED",
      primary: "#ff008a",
      dark: false,
    },
    trendCharts: [
      {
        key: "conversions",
        title: "Conversions",
        subtitle: "Demo bookings from Google Ads",
        format: "number",
      },
      {
        key: "adSpend",
        title: "Ad Spend",
        subtitle: "Total weekly ad spend",
        format: "dollar",
      },
      {
        key: "costPerConversion",
        title: "Cost per Conversion",
        subtitle: "Ad spend per demo booking",
        format: "dollar2",
      },
      {
        key: "cpc",
        title: "CPC",
        subtitle: "Average cost per click",
        format: "dollar2",
      },
    ],
  },
  mobilecraftbars: {
    slug: "mobilecraftbars",
    name: "Mobile Craft Bars",
    logo: "/logos/mcb.png",
    emails: ["mobilecraftbars@gmail.com"],
    splash: "/splash-images/mcb.webp",
    brand: {
      background: "#0d0f17",
      surface: "#0c0c0d",
      primary: "#3d87bd",
      dark: true,
    },
    trendCharts: [
      {
        key: "conversions",
        title: "Conversions",
        subtitle: "Booking inquiries from Google Ads",
        format: "number",
      },
      {
        key: "adSpend",
        title: "Ad Spend",
        subtitle: "Total weekly ad spend",
        format: "dollar",
      },
      {
        key: "costPerConversion",
        title: "Cost per Conversion",
        subtitle: "Ad spend per booking inquiry",
        format: "dollar2",
      },
      {
        key: "cpc",
        title: "CPC",
        subtitle: "Average cost per click",
        format: "dollar2",
      },
    ],
  },
};

export function getClient(slug: string): ClientConfig | undefined {
  return clients[slug];
}

export function getClientPassword(slug: string): string | undefined {
  const key = `CLIENT_PASSWORD_${slug.toUpperCase()}` as keyof typeof process.env;
  return process.env[key] ?? undefined;
}

export function getAllClientSlugs(): string[] {
  return Object.keys(clients);
}

export function getDnLogo(client: ClientConfig): string {
  return client.brand.dark ? "/dn-logo.png" : "/dn-logo-dark.png";
}
