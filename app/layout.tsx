import type { Metadata } from "next";
import { Cormorant_Garamond, Lato } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "Ethio Pilates | Move with intention. Feel the transformation",
  description: "Ethio Pilates is more than a studio it's a space for movement, healing, and self-connection. We combine Pilates, yoga, and curated wellness experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${lato.variable} scroll-smooth overflow-x-hidden`}
    >
      <body className="font-sans antialiased text-stone-800 bg-[#FAF9F6] overflow-x-hidden">
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
