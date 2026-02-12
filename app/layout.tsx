import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Luis Rivera Dev Profile",
    template: "%s | Luis Rivera",
  },
  description:
    "Web3 engineer building DeFi infrastructure, smart contracts, and scalable protocols. Technical lead for on-chain systems and dApps.",
  openGraph: {
    title: "Luis Rivera Dev Profile",
    description:
      "Web3 engineer building DeFi infrastructure, smart contracts, and scalable protocols. Technical lead for on-chain systems and dApps.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luis Rivera Dev Profile",
    description:
      "Web3 engineer building DeFi infrastructure, smart contracts, and scalable protocols. Technical lead for on-chain systems and dApps.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem storageKey="cv-theme">
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
