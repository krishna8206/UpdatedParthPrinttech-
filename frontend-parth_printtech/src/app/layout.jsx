import { Plus_Jakarta_Sans, Geist_Mono, Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import BackgroundAnimation from "@/components/BackgroundAnimation/BackgroundAnimation";

// Using Plus Jakarta Sans for a highly professional body font
const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-geist-sans", // Keeping variable name intact for seamless CSS compatibility
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Using Outfit for modern, premium, geometric headings
const outfit = Outfit({
  variable: "--font-montserrat", // Keeping variable name intact for seamless CSS compatibility
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

// Using Playfair Display for ultra-premium elegant accents
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Parth Printtech",
  description: "Premium Printing Solutions",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${geistMono.variable} ${outfit.variable} ${playfair.variable}`}>
      <body>
        <BackgroundAnimation />
        {children}
      </body>
    </html>
  );
}

