"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Simple inline loader component to avoid import issues
function SimpleLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-blue-600 font-medium">Loading...</p>
    </div>
  );
}

type LoadingContextType = {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Reset loading state when route changes
  useEffect(() => {
    setIsLoading(false);
  }, [pathname, searchParams]);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
          <SimpleLoader />
        </div>
      )}
      {children}
    </LoadingContext.Provider>
  );
}

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    // If we're outside the context, provide a fallback that doesn't break the app
    return {
      isLoading: false,
      startLoading: () => console.warn("LoadingProvider not found"),
      stopLoading: () => console.warn("LoadingProvider not found"),
    };
  }
  return context;
};
