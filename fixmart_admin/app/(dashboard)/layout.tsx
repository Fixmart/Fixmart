import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import LeftSideBar from "@/components/layout/LeftSideBar";
import TopBar from "@/components/layout/TopBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fixmart Admin dashboard",
  description: "Admin side",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={inter.className}>
        <div className="flex max-lg:flex-col">
            <TopBar/>
                <LeftSideBar/>
                <div className="flex-1">{children}</div>
        </div>
        </body>
    </html>
    </ClerkProvider>
  );
}
