import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { TrustSection } from "@/components/home/TrustSection";
import { FeaturedFleet } from "@/components/home/FeaturedFleet";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Ultra-Luxury Hero Search Section */}
      <HeroSection />

      {/* 2. Three Distinct Vehicle Categories */}
      <CategoryShowcase />

      {/* 3. Featured Verified Island Fleet */}
      <FeaturedFleet />

      {/* 4. Trust, KYC, 4-Angle Handover & Comprehensive Insurance Pillars */}
      <TrustSection />
    </div>
  );
}
