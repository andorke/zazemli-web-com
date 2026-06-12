import type { Metadata } from "next";
import { caveat, spectral, unbounded } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "ЗАЗЕМЛИ",
  description: "Боксы для пересадки комнатных растений",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${unbounded.variable} ${spectral.variable} ${caveat.variable} h-full font-sans antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
