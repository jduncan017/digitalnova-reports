export type ClientBrand = {
  background: string;
  surface: string;
  primary: string;
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
      dark: true,
    },
  },
  eventcombo: {
    slug: "eventcombo",
    name: "Eventcombo",
    password: "eventcombo-2026",
    logo: "/logos/eventcombo.png", // uncomment after adding the file
    brand: {
      background: "#fff",
      surface: "#FFF0ED",
      primary: "#ff008a",
      dark: false,
    },
  },
  mobilecraftbars: {
    slug: "mobilecraftbars",
    name: "Mobile Craft Bars",
    password: "mcb-2026",
    logo: "/logos/mcb.png",
    brand: {
      background: "#0d0f17",
      surface: "#0c0c0d",
      primary: "#3d87bd",
      dark: true,
    },
  },
};

export function getClient(slug: string): ClientConfig | undefined {
  return clients[slug];
}

export function getAllClientSlugs(): string[] {
  return Object.keys(clients);
}

export function getDnLogo(client: ClientConfig): string {
  return client.brand.dark ? "/dn-logo.png" : "/dn-logo-dark.png";
}
