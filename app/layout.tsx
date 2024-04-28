import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import Loader from "./components/loader";
import { LiaCoinsSolid } from "react-icons/lia";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MakePlace Cost Summary",
  description: "Get FFXIV marketboard prices from MakePlace files",
};

const Loading = () => (
  <div className="flex flex-col items-center grow">
    <Loader />
  </div>
)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} flex flex-col bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 min-h-screen`}>
        <div className="flex flex-col items-center p-6">
          <div className="flex text-4xl font-semibold tracking-tight text-slate-400 p-2 gap-3">
            <LiaCoinsSolid />MakePlace Cost Summary
          </div>
        </div>
        <Suspense fallback={<Loading />}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
