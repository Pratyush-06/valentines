import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Secret Valentine 💖 | Anonymous Confessions",
  description:
    "Write your anonymous Valentine confession and share it with someone special. Beautiful, anonymous, and heartfelt.",
  keywords: ["valentine", "confession", "anonymous", "love", "romantic"],
  openGraph: {
    title: "Secret Valentine 💖",
    description: "Someone has an anonymous confession for you...",
    type: "website",
    siteName: "Secret Valentine",
  },
  twitter: {
    card: "summary_large_image",
    title: "Secret Valentine 💖",
    description: "Someone has an anonymous confession for you...",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-black text-white`}>
        {/* Ambient glow effects */}
        <div className="ambient-glow glow-pink" />
        <div className="ambient-glow glow-rose" />
        {children}
      </body>
    </html>
  );
}
