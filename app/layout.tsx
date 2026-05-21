import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "well-calm",
  description: "A wellness companion for your state, social, and ambient world.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[#ededed]">{children}</body>
    </html>
  );
}
