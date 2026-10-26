import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Dancing_Script, Montserrat, Outfit } from "next/font/google";
import "./globals.css";
import { SmoothScrolling, Navbar, Footer, ScrollToTop } from "@/components/layout";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { UserProvider } from "@/context/UserContext";
import { ReviewsProvider } from "@/context/ReviewsContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { AdminProvider } from "@/context/AdminContext";
import { CustomSectionsProvider } from "@/context/CustomSectionsContext";
import dynamic from "next/dynamic";

const AccountModal = dynamic(
  () => import("@/components/features/AccountModal").then((mod) => mod.AccountModal)
);

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
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

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
      className={`${geistSans.variable} ${geistMono.variable} ${dancingScript.variable} ${montserrat.variable} ${outfit.variable} max-w-full overflow-x-clip overscroll-x-none`}
    >
      <body className="min-h-screen bg-white text-veyro-black antialiased max-w-full overflow-x-clip overscroll-x-none">
        <ProductsProvider>
          <CartProvider>
            <WishlistProvider>
              <UserProvider>
                <ReviewsProvider>
                  <AdminProvider>
                    <CustomSectionsProvider>
                      <SmoothScrolling>
                        <div className="min-h-screen flex flex-col bg-white text-veyro-black max-w-full overflow-x-clip">
                          <Navbar />
                          <main className="flex-1 w-full max-w-full overflow-x-clip">
                            {children}
                          </main>
                          <Footer />
                        </div>
                      </SmoothScrolling>
                      <ScrollToTop />
                      <AccountModal />
                    </CustomSectionsProvider>
                  </AdminProvider>
                </ReviewsProvider>
              </UserProvider>
            </WishlistProvider>
          </CartProvider>
        </ProductsProvider>
      </body>
    </html>
  );
}
