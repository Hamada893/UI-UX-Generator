import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./provider";

const appFont = DM_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UI/UX Mock Generator App",
  description: "Generate High Quality UI/UX Mocks For Your Projects For Both Mobile and Desktop Devices",
};

/**
 * Application root layout that wraps pages with authentication and global providers and configures the HTML root.
 *
 * Renders an HTML document with lang="en", applies the global font class to the body, sets `suppressHydrationWarning` on the body, and nests the app `children` inside the local `Provider` while the whole tree is wrapped by `ClerkProvider`.
 *
 * @param children - The page content to render inside the layout
 * @returns The root JSX element for the application layout
 */
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
          suppressHydrationWarning
        >
          <Provider>{children}</Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
