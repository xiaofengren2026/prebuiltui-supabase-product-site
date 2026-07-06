import type { Metadata, Viewport } from "next";
import { Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";

import "./globals.css";

const notoSans = Noto_Sans_SC({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const notoSerif = Noto_Serif_SC({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "青岚东方美学",
  description: "东方美学饰品展示网站",
  manifest: "/manifest.webmanifest",
  applicationName: "青岚东方",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "青岚东方",
  },
  icons: {
    apple: "/apple-icon",
    icon: [
      { url: "/icon?size=192", sizes: "192x192", type: "image/png" },
      { url: "/icon?size=512", sizes: "512x512", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#dfe8e1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${notoSans.variable} ${notoSerif.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
