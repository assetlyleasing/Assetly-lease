import type { Metadata } from "next";
import { DM_Serif_Display, DM_Serif_Text, Inter_Tight } from "next/font/google";
import "./globals.css";

/*
 * The three approved families (SOURCE_OF_TRUTH.md §7). Each is exposed as a CSS
 * variable that styles/tokens.css maps onto --d / --s / --u, so components only
 * ever reference the token, never the font name.
 */
const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const dmSerifText = DM_Serif_Text({
  variable: "--font-dm-serif-text",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Assetly",
  description: "Structured operating leases for growing businesses.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${dmSerifDisplay.variable} ${dmSerifText.variable} ${interTight.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
