import type { Metadata } from "next";
import { Plus_Jakarta_Sans as JakartaSans } from "next/font/google";
import "./globals.css";

const jakartaSans = JakartaSans({
  variable: "--jakarta-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "SAFE",
  description: "SAFE is Security Anti Fraud Executive",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jakartaSans.variable} jakarta-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
