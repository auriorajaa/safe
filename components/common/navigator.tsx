"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

/**
 * A robust navigation manager for Next.js applications.
 * - Shows loading spinner during navigation
 * - Handles errors gracefully
 * - Ensures minimum loading time for better UX
 */
export default function Navigator() {
  const router = useRouter();
  const pathname = usePathname();
  const [navigating, setNavigating] = useState(false);
  const [destination, setDestination] = useState("");

  // Listen for custom navigation events
  useEffect(() => {
    const handleNavigation = (event: CustomEvent) => {
      if (event.detail && event.detail.url) {
        setNavigating(true);
        setDestination(event.detail.url);

        // Minimum loading time
        setTimeout(() => {
          try {
            router.push(event.detail.url);
          } catch (error) {
            console.error("Navigation failed:", error);
            window.location.href = event.detail.url;
          }
        }, 750);
      }
    };

    window.addEventListener(
      "navigate-with-loading" as any,
      handleNavigation as EventListener
    );

    return () => {
      window.removeEventListener(
        "navigate-with-loading" as any,
        handleNavigation as EventListener
      );
    };
  }, [router]);

  // Reset navigation state when pathname changes
  useEffect(() => {
    setNavigating(false);
  }, [pathname]);

  // Disable scrolling when navigating
  useEffect(() => {
    if (navigating) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Just in case component unmounts during navigating
    return () => {
      document.body.style.overflow = "";
    };
  }, [navigating]);

  if (!navigating) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background px-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Card className="p-6 rounded-2xl text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-14 h-14 mt-2 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <CardContent className="space-y-2">
            <h2 className="text-xl font-semibold">Please wait...</h2>
            <p className="text-muted-foreground text-sm">
              We’re preparing something great for you. This page is currently
              loading — it will be ready in just a moment.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
