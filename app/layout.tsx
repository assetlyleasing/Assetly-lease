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
  // §22: canonical/Open Graph URLs on individual routes resolve against this.
  metadataBase: new URL("https://assetly.lease"),
  title: "Assetly",
  description: "Structured operating leases for growing businesses.",
  verification: {
    google: "eqSSz8tlxoheOpZkVP4QCXg8M_4i_72rh0nE_CmHppg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      // globals.css sets `scroll-behavior: smooth`; this tells Next.js it is
      // deliberate, so route transitions still jump to the top instead of
      // animating the whole page scroll.
      data-scroll-behavior="smooth"
      className={`${dmSerifDisplay.variable} ${dmSerifText.variable} ${interTight.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
