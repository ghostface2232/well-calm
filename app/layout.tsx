import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// SF Pro Rounded — the design's typeface, self-hosted from public/fonts.
// next/font emits the @font-face rules + preloads, and exposes a CSS variable
// (--font-rounded) that globals.css applies to <body>.
const sfProRounded = localFont({
  src: [
    { path: "../public/fonts/SF-Pro-Rounded-Light.woff2", weight: "300", style: "normal" },
    { path: "../public/fonts/SF-Pro-Rounded-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/SF-Pro-Rounded-Medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/SF-Pro-Rounded-Semibold.woff2", weight: "600", style: "normal" },
  ],
  display: "swap",
  variable: "--font-rounded",
  fallback: ["-apple-system", "BlinkMacSystemFont", "system-ui", "Segoe UI", "sans-serif"],
});

export const metadata: Metadata = {
  title: "well-calm",
  description: "A wellness companion for your state, social, and ambient world.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`h-full antialiased ${sfProRounded.variable}`}>
      {/* the single app background lives on <body> in globals.css */}
      <body className="min-h-full">{children}</body>
    </html>
  );
}
