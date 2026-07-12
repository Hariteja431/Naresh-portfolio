import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import SmoothScrolling from "@/components/SmoothScrolling";
import Preloader from "@/components/Preloader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.instagram.com/filmedby.naresh/'), // Replace with actual domain when deployed
  title: {
    default: "Filmed by Naresh | Cinematic Visual Storyteller",
    template: "%s | Filmed by Naresh",
  },
  description: "Independent Indian visual storyteller specializing in travel photography, cinematography, aerial filmmaking, and commercial brand campaigns.",
  keywords: [
    "Filmed by Naresh", "Naresh", "Cinematography", "Travel Photography", "Aerial Filmmaking", 
    "Drone Videography", "Commercial Photography", "Indian Visual Storyteller", "Brand Campaigns", 
    "Tourism Films", "Lifestyle Photography", "Director of Photography", "Video Editor"
  ],
  authors: [{ name: "Naresh", url: "https://www.instagram.com/filmedby.naresh/" }],
  creator: "Naresh",
  publisher: "Filmed by Naresh",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Filmed by Naresh | Cinematic Visual Storyteller",
    description: "Independent Indian visual storyteller specializing in travel photography, cinematography, and aerial filmmaking.",
    url: "https://www.instagram.com/filmedby.naresh/",
    siteName: "Filmed by Naresh",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/placeholder.jpg",
        width: 1200,
        height: 630,
        alt: "Filmed by Naresh - Cinematic Portfolio",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Filmed by Naresh | Cinematic Visual Storyteller",
    description: "Independent Indian visual storyteller specializing in travel photography, cinematography, and aerial filmmaking.",
    creator: "@filmedbynaresh",
    images: ["/placeholder.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: "Photography & Videography",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased bg-black text-white overflow-hidden`} suppressHydrationWarning>
        <Preloader />
        <SmoothScrolling>
          {children}
        </SmoothScrolling>
      </body>
    </html>
  );
}
