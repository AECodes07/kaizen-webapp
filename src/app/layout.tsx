import type { Metadata } from "next";
import { Merriweather } from "next/font/google";
import "./globals.css";

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Kaizen — Harness Your Mind",
  description: "Kaizen is an intelligent mind map that connects your memories, goals, feelings, and thoughts across every aspect of your life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.cdnfonts.com/css/oak-sans" rel="stylesheet" />
      </head>
      <body className={`${merriweather.variable} antialiased relative`}>
        {children}
        <div className="pointer-events-none fixed inset-0 z-40 shadow-[inset_0_0_150px_var(--edge-haze)]" />
      </body>
    </html>
  );
}
