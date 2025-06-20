import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "./components/SessionProvider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Campaign Naming Tool - CitizenGO",
  description: "Streamline your campaign creation process with automated naming conventions and seamless integration with Iterable and Asana.",
  icons: {
    icon: [
      { url: "/favicon-cgo/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon-cgo/favicon.svg", type: "image/svg+xml" }
    ],
    shortcut: "/favicon-cgo/favicon.ico",
    apple: { url: "/favicon-cgo/apple-touch-icon.png", sizes: "180x180" }
  },
  manifest: "/favicon-cgo/site.webmanifest"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon-cgo/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon-cgo/favicon.svg" />
        <link rel="shortcut icon" href="/favicon-cgo/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon-cgo/apple-touch-icon.png" />
        <link rel="manifest" href="/favicon-cgo/site.webmanifest" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
