"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  LineChart,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useState, useEffect, JSX } from "react";
import { MotionDiv, MotionSection } from "../common/motion-wrapper";
import {
  buttonVariants,
  containerVariants,
  itemVariants,
} from "@/lib/constants";

type Feature = {
  icon: React.ElementType;
  text: string;
};

export default function HeroSection(): JSX.Element {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [activeFeature, setActiveFeature] = useState<number>(0);

  const features: Feature[] = [
    { icon: ShieldCheck, text: "Protect your business from fraud" },
    { icon: LineChart, text: "Real-time sentiment analysis" },
    { icon: AlertTriangle, text: "Early warning system for threats" },
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MotionSection
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative overflow-hidden"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-14 md:py-18">
          {/* Left Column - Content */}
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="inline-flex mb-6">
              <Badge
                variant="outline"
                className="px-4 py-2 rounded-full border-blue-300 bg-blue-50 backdrop-blur-sm"
              >
                <Sparkles className="!h-5 !w-5 mr-2 text-blue-600" />
                <p className="text-sm font-medium text-blue-700">
                  AI-Powered Protection
                </p>
              </Badge>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Predict, Prevent, and{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-white px-3">Protect</span>
                <span
                  className="absolute inset-0 bg-blue-600 rounded-lg transform -rotate-1"
                  aria-hidden="true"
                ></span>
              </span>
              <br />
              with SAFE
            </h1>

            <div className="h-20 relative">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`flex items-center text-xl text-gray-700 transition-all duration-500 absolute ${
                    index === activeFeature
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                >
                  {index === activeFeature && (
                    <>
                      <feature.icon className="h-6 w-6 mr-2 text-blue-600" />
                      <p>{feature.text}</p>
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <MotionDiv variants={itemVariants} whileHover={buttonVariants}>
                <Button
                  variant="default"
                  className="text-white text-base px-8 py-6 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 rounded-xl shadow-lg shadow-blue-300/30 transition-all duration-300 font-semibold"
                >
                  <Link href="/#pricing" className="flex items-center gap-2">
                    <span>Try SAFE Now</span>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </MotionDiv>

              {/* <MotionDiv variants={itemVariants} whileHover={buttonVariants}>
                {" "}
                <Button
                  variant="outline"
                  className="text-blue-700 border-blue-200 hover:bg-blue-50 hover:text-blue-700 rounded-xl px-8 py-6 transition-all duration-300"
                >
                  <Link href="/demo">Watch Demo</Link>
                </Button>
              </MotionDiv> */}
            </div>
          </div>

          {/* Right Column - Visual */}
          <div
            className={`relative transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            <div className="relative bg-white border border-blue-100 p-6 rounded-2xl shadow-xl shadow-blue-100/50 rotate-1 backdrop-blur-sm">
              <div className="absolute -top-3 -right-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 animate-pulse">
                  <span className="h-4 w-4 rounded-full bg-blue-200 opacity-75"></span>
                </span>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">
                      Fraud Detection
                    </h3>
                    <p className="text-sm text-gray-500">
                      Real-time monitoring
                    </p>
                  </div>
                </div>
                <div className="bg-green-100 px-3 py-1 rounded-full text-green-700 text-sm font-medium">
                  Active
                </div>
              </div>

              <div className="space-y-4">
                <div className="h-2 bg-blue-100 rounded-full w-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full w-2/3 animate-pulse"></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Risk Score</p>
                    <p className="text-2xl font-bold text-blue-700">87%</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Alerts</p>
                    <p className="text-2xl font-bold text-blue-700">3</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                    <p className="text-sm text-gray-700">
                      Unusual transaction pattern detected
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-14 -left-4 bg-blue-50 border border-blue-100 p-4 rounded-lg shadow-lg -rotate-3 z-20 w-48">
              <div className="flex items-center mb-2">
                <LineChart className="h-4 w-4 text-blue-600 mr-2" />
                <p className="text-sm font-medium text-gray-800">
                  Market Sentiment
                </p>
              </div>
              <div className="h-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mb-1"></div>
              <p className="text-xs text-gray-500">Updated just now</p>
            </div>
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
