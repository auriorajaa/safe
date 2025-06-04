import DemoSection from "@/components/home/demo-section";
import HeroSection from "@/components/home/hero-section";
import PricingSection from "@/components/home/pricing-section";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative w-full">
      <div className="flex flex-col">
        <HeroSection />
        <DemoSection />
        {/* <HowItWorksSection /> */}
        <PricingSection />
      </div>
    </div>
  );
}
