export type ClientBrand = {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  dark: boolean;
};

export type ClientConfig = {
  slug: string;
  name: string;
  password: string;
  logo?: string;
  brand: ClientBrand;
};

const clients: Record<string, ClientConfig> = {
  finalbit: {
    slug: "finalbit",
    name: "FinalBit",
    password: "finalbit-2026",
    logo: "/logos/finalbit.png",
    brand: {
      background: "#191b1f",
      surface: "#0c0a09",
      primary: "#1d6ee3",
      secondary: "#1d6ee3",
      dark: true,
    },
  },
  // Add more clients here:
  // eventcombo: { ... },
  // mobilecraftbars: { ... },
};

export function getClient(slug: string): ClientConfig | undefined {
  return clients[slug];
}

export function getAllClientSlugs(): string[] {
  return Object.keys(clients);
}
