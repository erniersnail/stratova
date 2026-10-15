import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { IS_PUBLIC_MODE } from "@/lib/site";
import "@/styles/globals.css";
import "@/styles/animations.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Simplicial Capital",
  description: "Quantitative Investment Research Platform",
  ...(IS_PUBLIC_MODE
    ? {}
    : { robots: { index: false, follow: false } }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full scroll-smooth`}>
      <body className="flex h-full flex-col overflow-x-clip font-sans antialiased">
        {/* No-JS fallback: show every scroll-reveal section immediately. */}
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html:
                ".fade-in-section{opacity:1 !important;transform:none !important;}",
            }}
          />
        </noscript>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
