import type { Metadata } from "next";
import { Plus_Jakarta_Sans as JakartaSans } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import ErrorBoundary from "@/components/common/error-boundary";
import Navigator from "@/components/common/navigator";

const jakartaSans = JakartaSans({
  variable: "--jakarta-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "SAFE",
  description:
    "SAFE (Security Anti Fraud Executive) – Advanced fraud detection and sentiment analysis solutions to safeguard transactions and evaluate headline news impact.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${jakartaSans.variable} jakarta-sans antialiased`}>
          <ErrorBoundary>
            <Navigator />
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Toaster />
              <Footer />
            </div>
          </ErrorBoundary>
        </body>
      </html>
    </ClerkProvider>
  );
}
