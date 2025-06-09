// app/sign-up/page.tsx
"use client";

import { SignUp } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

export default function Page() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center">
      <div
        className={`w-full max-w-md space-y-8 transform transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="text-center space-y-4">
          <Badge className="px-4 py-2 bg-blue-100 border border-blue-300 text-blue-700 rounded-full backdrop-blur-md inline-flex items-center gap-2">
            Start Securing Your Business
          </Badge>

          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Create Your SAFE Account
          </h1>
          <p className="text-gray-600 text-md">
            Join thousands who trust us for proactive fraud prevention, advanced
            analytics, and AI-powered finance.
          </p>
        </div>

        <div className="p-6 animate-fadeInUp">
          <SignUp
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

        <div className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a
            href="/sign-in"
            className="text-blue-600 hover:underline hover:text-blue-800 transition-colors"
          >
            Sign in here
          </a>
        </div>
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
