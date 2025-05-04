// app/sign-in/page.tsx
"use client";

import { SignIn } from "@clerk/nextjs";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function Page() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <div
        className={`w-full max-w-md space-y-8 transform transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="text-center space-y-4">
          <Badge className="px-4 py-2 bg-blue-100 border border-blue-300 text-blue-700 rounded-full backdrop-blur-md inline-flex items-center gap-2">
            Welcome to the SAFE
          </Badge>

          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Secure Sign In Portal
          </h1>
          <p className="text-gray-600 text-lg">
            One portal. Infinite protection. Start now.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 backdrop-blur-sm animate-fadeInUp">
          <SignIn
            appearance={{
              elements: {
                formButtonPrimary:
                  "bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors duration-300",
                headerTitle: "text-xl font-bold text-blue-600",
                headerSubtitle: "text-sm text-gray-500",
              },
              variables: {
                colorPrimary: "#2563EB", // Tailwind's blue-600
              },
            }}
          />
        </div>

        <p className="text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <a
            href="/sign-up"
            className="text-blue-600 hover:underline hover:text-blue-800 transition-colors"
          >
            Create one now
          </a>
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
