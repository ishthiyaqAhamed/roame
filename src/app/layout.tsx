import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/context";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans-luxury",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-serif-luxury",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Roame | Premier Peer-to-Peer Vehicle Marketplace in Sri Lanka",
  description:
    "Book verified private cars, passenger vans, chauffeured wedding classics, and adventure motorbikes across Sri Lanka with mandatory comprehensive insurance and escrow deposit protection.",
  keywords: [
    "Sri Lanka vehicle rental",
    "rent a car Colombo",
    "wedding car hire Sri Lanka",
    "KDH van rental Kandy",
    "scooter rental Galle",
    "peer to peer car rental",
    "Roame Sri Lanka",
  ],
  openGraph: {
    title: "Roame | Peer-to-Peer Vehicle Marketplace in Sri Lanka",
    description:
      "Direct verified vehicle rentals across all 25 districts of Sri Lanka. 100% Comprehensive Insurance Guarantee.",
    type: "website",
    locale: "en_LK",
    siteName: "Roame Sri Lanka",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${cormorantGaramond.variable} dark`}
    >
      <body className="bg-[#08090D] text-[#F5F6FA] min-h-screen flex flex-col antialiased selection:bg-[#D4AF37] selection:text-[#08090D]">
        <I18nProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
