import type { Metadata, Viewport } from "next";
import SyncProvider from "@/components/SyncProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "딱 하나",
  description: "딱 하나만 하면 돼. 할일 관리 + 픽셀 방꾸미기",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "딱 하나",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#C4B5FD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased min-h-screen max-w-lg mx-auto relative">
        <SyncProvider>{children}</SyncProvider>
      </body>
    </html>
  );
}
