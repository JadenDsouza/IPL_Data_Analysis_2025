import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IPL Data Analysis Dashboard",
  description: "IPL (2008-2019) match and ball-by-ball analytics dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
