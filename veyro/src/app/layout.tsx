import type { Metadata } from "next";
import { Geist, Geist_Mono, Dancing_Script, Montserrat } from "next/font/google";
import "./globals.css";
import { SmoothScrolling, Navbar, Footer, ScrollToTop } from "@/components/layout";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { UserProvider } from "@/context/UserContext";
import { ReviewsProvider } from "@/context/ReviewsContext";
import { AccountModal } from "@/components/features";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "VEYRO | Modern Men's Fashion & Footwear",
  description:
    "Contemporary fashion and footwear for modern men. Sharp silhouettes, premium fabrics, and elevated essentials.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${dancingScript.variable} ${montserrat.variable}`}
    >
      <body className="min-h-screen bg-white text-veyro-black antialiased">
        <CartProvider>
          <WishlistProvider>
            <UserProvider>
              <ReviewsProvider>
                <SmoothScrolling>
                  <div className="min-h-screen flex flex-col bg-white text-veyro-black">
                    <Navbar />
                    <main className="flex-1 w-full">
                      {children}
                    </main>
                    <Footer />
                  </div>
                </SmoothScrolling>
                <ScrollToTop />
                <AccountModal />
              </ReviewsProvider>
            </UserProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
