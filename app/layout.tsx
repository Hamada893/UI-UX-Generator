import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const appFont = DM_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UI/UX Mock Generator App",
  description: "Generate High Quality UI/UX Mocks For Your Projects For Both Mobile and Desktop Devices",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={appFont.className}
      >
        {children}
      </body>
    </html>
    </ClerkProvider>
  );
}
