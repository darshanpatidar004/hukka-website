import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AgeGate from "@/components/AgeGate";
import SmokeParticles from "@/components/SmokeParticles";
import CursorFollower from "@/components/CursorFollower";


export const metadata: Metadata = {
  title: "Hukka Dubai | Luxury Hookahs & Elite Lifestyle Accessories",
  description: "Experience the art of luxury hookah. Crafted for connoisseurs, imported from Dubai's finest artisans. Shop premium, designer, and travel hookahs in India.",
  keywords: ["luxury hookah", "dubai hookah", "premium hookahs india", "designer hookahs", "travel hookah", "hukka dubai"],
  authors: [{ name: "Hukka Dubai" }],
  openGraph: {
    title: "Hukka Dubai | Luxury Hookahs & Elite Lifestyle Accessories",
    description: "Experience the art of luxury hookah. Crafted for connoisseurs, imported from Dubai's finest artisans. Shop premium, designer, and travel hookahs in India.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  }>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans">
        <AppProvider>
          {/* Drifting background canvas smoke simulator */}
          <SmokeParticles />
          
          {/* Luxury custom cursor follower */}
          <CursorFollower />

          {/* Blocks content for underage visitors */}
          <AgeGate />


          {/* Persistent Luxury Navigation */}
          <Header />

          {/* Main Content Area */}
          <main className="flex-grow flex flex-col relative z-10">
            {children}
          </main>


          {/* Footer & Compliance Warnings */}
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
