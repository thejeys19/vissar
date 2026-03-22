import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SessionProvider } from "@/components/session-provider";

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "Vissar — Google Reviews Widget That Matches Your Website",
  description: "Embed beautiful Google Reviews on your website. Auto-detects your site's fonts, colors, and style. 14 layouts, 10 templates. Setup in 2 minutes. Free to start.",
  keywords: "google reviews widget, embed google reviews, reviews widget, google reviews embed, review widget for website, google places widget",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Vissar — Google Reviews Widget That Matches Your Website",
    description: "Embed beautiful Google Reviews on your website. Auto-detects your site's design. 14 layouts, 10 templates. Free to start.",
    siteName: "Vissar",
    url: "https://www.vissar.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vissar — Google Reviews Widget That Matches Your Website",
    description: "Embed beautiful Google Reviews on your website. Auto-detects your site's design. Free to start.",
  },
  metadataBase: new URL("https://www.vissar.com"),
  alternates: {
    canonical: "https://www.vissar.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", plusJakarta.variable)}>
      <body className={`${plusJakarta.variable} antialiased`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
