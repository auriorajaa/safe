// components/translation-loader.tsx

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Languages, Newspaper, Clock } from "lucide-react";

interface TranslationLoaderProps {
  isTranslating?: boolean;
  message?: string;
}

export default function TranslationLoader({
  isTranslating = false,
  message,
}: TranslationLoaderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [dots, setDots] = useState("");

  const steps = [
    {
      icon: Newspaper,
      text: "Mengambil berita terbaru",
      color: "text-blue-600",
    },
    {
      icon: Languages,
      text: "Menerjemahkan ke Bahasa Indonesia",
      color: "text-green-600",
    },
    { icon: Clock, text: "Memproses data", color: "text-purple-600" },
  ];

  useEffect(() => {
    if (isTranslating) {
      const stepInterval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % steps.length);
      }, 2000);

      const dotsInterval = setInterval(() => {
        setDots((prev) => {
          if (prev.length >= 3) return "";
          return prev + ".";
        });
      }, 500);

      return () => {
        clearInterval(stepInterval);
        clearInterval(dotsInterval);
      };
    }
  }, [isTranslating, steps.length]);

  const defaultMessage = isTranslating
    ? "Sedang memproses berita Indonesia..."
    : "Memuat halaman...";

  const displayMessage = message || defaultMessage;

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-background">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Card className="p-6 rounded-2xl text-center space-y-6">
          <div className="flex justify-center">
            <motion.div
              className="w-14 h-14 mt-4 border-4 border-blue-600 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>

          <CardContent className="space-y-4">
            <h2 className="text-xl font-semibold">
              {isTranslating ? "Mohon Tunggu" : "Please wait"}
              <span className="inline-block w-8 text-left">{dots}</span>
            </h2>

            <p className="text-muted-foreground text-sm">{displayMessage}</p>

            {isTranslating && (
              <motion.div
                className="space-y-3 mt-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index === currentStep;
                  const isCompleted = index < currentStep;

                  return (
                    <motion.div
                      key={index}
                      className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-500 ${
                        isActive
                          ? "bg-blue-50 dark:bg-blue-950 scale-105"
                          : isCompleted
                          ? "bg-green-50 dark:bg-green-950"
                          : "bg-gray-50 dark:bg-gray-800"
                      }`}
                      animate={{
                        scale: isActive ? 1.02 : 1,
                        opacity: isActive ? 1 : 0.7,
                      }}
                    >
                      <motion.div
                        animate={{
                          rotate: isActive ? 360 : 0,
                          scale: isActive ? 1.1 : 1,
                        }}
                        transition={{
                          rotate: {
                            duration: 2,
                            repeat: isActive ? Infinity : 0,
                            ease: "linear",
                          },
                          scale: { duration: 0.3 },
                        }}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            isActive
                              ? step.color
                              : isCompleted
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        />
                      </motion.div>
                      <span
                        className={`text-sm font-medium ${
                          isActive
                            ? step.color
                            : isCompleted
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {step.text}
                      </span>
                      {isCompleted && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto text-green-600 text-xs"
                        >
                          ✓
                        </motion.span>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {!isTranslating && (
              <p className="text-muted-foreground text-sm mt-2">
                This page is currently loading — it will be ready in just a
                moment.
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
