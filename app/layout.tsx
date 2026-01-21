import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PowerTranz Starter",
  description:
    "This demo showcases PowerTranz payment integration capabilities including secure tokenization and payment capture functionality.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <nav className="border-b">
            <div className="flex h-16 items-center px-4 max-w-6xl mx-auto">
              <div className="flex items-center space-x-4">
                <Link
                  href="/"
                  className={`${geistMono.variable} font-mono font-semibold text-lg`}
                >
                  powertranz-starter
                </Link>
              </div>
              <div className="ml-auto">
                <ThemeToggle />
              </div>
            </div>
          </nav>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
