import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import { Toaster } from "react-hot-toast";

const quicksand = Quicksand({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ripple",
  description: "Future message sender",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={clsx(quicksand.className, "w-screens h-screen")}>
        <link rel="icon" href="/images/icon.ico" sizes="any" />
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
