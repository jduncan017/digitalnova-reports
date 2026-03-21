import "~/styles/globals.css";

import { type Metadata } from "next";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "DigitalNova Studio — Client Reports",
  description: "Weekly performance reports by DigitalNova Studio",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-gray-950 font-sans antialiased">{children}</body>
    </html>
  );
}
