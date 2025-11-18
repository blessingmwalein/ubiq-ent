import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/store/Provider";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/components/providers/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "UBIQ Entertainment - African Content Streaming Platform",
  description: "Stream the best African movies, series, and entertainment content. Watch anytime, anywhere.",
  keywords: ["streaming", "african content", "movies", "tv shows", "entertainment"],
  authors: [{ name: "UBIQ Entertainment" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: "UBIQ Entertainment - African Content Streaming",
    description: "Stream the best African movies, series, and entertainment content",
    siteName: "UBIQ Entertainment",
  },
  twitter: {
    card: "summary_large_image",
    title: "UBIQ Entertainment - African Content Streaming",
    description: "Stream the best African movies, series, and entertainment content",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans`}>
        <ReduxProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
