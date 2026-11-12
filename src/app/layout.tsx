import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import ChatStoreHydration from "@/lib/chat-store-hydration";

const roboto = Roboto({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AskFolio — AI research assistant",
  description: "AskFolio helps you think through your next big idea.",
};

export interface LayoutProps {
  children: React.ReactNode;
  params: Promise<Record<string, string | string[] | undefined>>;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        roboto.variable,
      )}
    >
      <body className="flex min-h-dvh w-full flex-col">
        <ChatStoreHydration />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
