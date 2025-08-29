import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Focus Music & Ambient Music | Stay Productive & Relax",
  description:
    "Discover the best focus music, ambient music, and lofi beats to boost productivity, relax, or study. Curated playlists for deep work, mindfulness, and creative flow.",
  icons: {
    icon: "/favicon.ico", // ✅ path to your favicon in /public
    shortcut: "/favicon.ico",
  },
  keywords: [
    "focus music",
    "ambient music",
    "lofi beats",
    "study music",
    "productivity music",
    "deep work soundtrack",
    "relaxing music",
    "concentration music",
  ],
  authors: [{ name: "Focus Music App" }],
  openGraph: {
    title: "Focus Music & Ambient Music | Stay Productive & Relax",
    description:
      "Stream curated focus music and ambient music playlists designed for productivity, studying, and relaxation.",
    url: "https://focus-music.vercel.app",
    siteName: "Focus Music App",
    images: [
      {
        url: "/favicon.ico", // ⚡ add an OG image in public/ later
        width: 1200,
        height: 630,
        alt: "Focus Music App - Ambient and Productivity Music",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Focus Music & Ambient Music | Stay Productive & Relax",
    description:
      "Focus better with ambient music, lofi beats, and study soundtracks.",
    images: ["/og-image.png"],
    creator: "@yourhandle", // replace with your Twitter if you want
  },
  metadataBase: new URL("https://focus-music.vercel.app"),
  alternates: {
    canonical: "https://focus-music.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
