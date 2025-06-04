"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoading } from "./loading-context";

// Simple inline loader component for fallback
function SimpleLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-blue-600 font-medium">Loading...</p>
      </div>
    </div>
  );
}

export default function NavigationLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();
  const { startLoading } = useLoading();
  const [localLoading, setLocalLoading] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    try {
      // Try to use the global loading context
      startLoading();
    } catch (error) {
      // Fallback to local loading state if context fails
      console.warn(
        "Failed to use LoadingContext, falling back to local loading state"
      );
      setLocalLoading(true);
    }

    // Add a minimum loading time of 750ms (3/4 second)
    setTimeout(() => {
      try {
        router.push(href);
      } catch (error) {
        console.error("Navigation failed:", error);
        // Fallback to traditional navigation
        window.location.href = href;
      }
    }, 750);
  };

  return (
    <>
      {localLoading && <SimpleLoader />}
      <a href={href} onClick={handleClick} className={className}>
        {children}
      </a>
    </>
  );
}
