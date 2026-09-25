import type { Metadata } from "next";
import { Archivo, Fraunces, Yellowtail } from "next/font/google";
import "./globals.css";
import AnimatedBackground from "@/components/AnimatedBackground";
import SmoothScroll from "@/components/SmoothScroll";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400", "500"],
});

const yellowtail = Yellowtail({
  variable: "--font-yellowtail",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Yurika Maha",
  description: "Full-Stack Developer based in Bali",
  openGraph: {
    title: "Yurika Maha",
    description: "Full-Stack Developer",
    images: [{ url: "/DSC08449.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yurika Maha — Portfolio",
    description: "Full-Stack Developer",
    images: ["/DSC08449.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${fraunces.variable} ${yellowtail.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AnimatedBackground />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
