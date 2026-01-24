import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/SideBar";

const ibmPlex = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-ibm",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Matin | Equipment Admin",
  description: "Administrative dashboard for Matin equipment rental system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${ibmPlex.className} flex bg-[#F5F5F5] min-h-screen text-[#475569]`}>

        <Sidebar />

        <main className="flex-1 p-8 overflow-y-auto h-screen">
          {children}
        </main>

      </body>
    </html>
  );
}