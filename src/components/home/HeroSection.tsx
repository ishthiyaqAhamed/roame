"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/context";
import {
  Search,
  MapPin,
  Calendar,
  ShieldCheck,
  Car,
  Sparkles,
  Bike,
  CheckCircle2,
  Compass,
} from "lucide-react";

export function HeroSection() {
  const { t } = useTranslation();
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [district, setDistrict] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const districts = [
    "Colombo",
    "Galle",
    "Kandy",
    "Bentota",
    "Nuwara Eliya",
    "Negombo",
    "Matara",
    "Jaffna",
    "Ella",
    "Trincomalee",
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (activeCategory !== "ALL") {
      params.set("category", activeCategory);
    }
    if (district) {
      params.set("district", district);
    }
    if (startDate) {
      params.set("start", startDate);
    }
    if (endDate) {
      params.set("end", endDate);
    }

    router.push(`/vehicles?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Cinematic Luxury Backdrop */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)] via-[var(--background)]/80 to-[var(--background)] z-10" />
        <div
          className="w-full h-full bg-cover bg-center opacity-25 dark:opacity-30 transform scale-105 transition-transform duration-1000"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=2000&q=80')",
          }}
        />
        {/* Ambient Gold Glow Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[var(--gold)]/10 rounded-full blur-[140px] pointer-events-none" />
      </div>

      <div className="relative z-20 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Verified Badge Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--gold)]/10 border border-[var(--border-gold)] shadow-lg mb-6 backdrop-blur-md">
          <ShieldCheck className="w-4 h-4 text-[var(--gold)]" />
          <span className="text-xs font-semibold text-[var(--gold)] tracking-wide">
            {t("hero.badge")}
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="font-serif-luxury text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--foreground)] mb-6 leading-[1.12]">
          {t("hero.titlePrefix")}{" "}
          <span className="text-gold-gradient italic">{t("hero.titleHighlight")}</span>
        </h1>

        {/* Subtitle */}
        <p className="font-sans-luxury text-sm sm:text-base md:text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          {t("hero.subtitle")}
        </p>

        {/* Search Experience Glass Console */}
        <div className="w-full max-w-4xl glass-card-gold rounded-3xl p-3 sm:p-5 shadow-2xl backdrop-blur-3xl">
          {/* Category Selector Tabs */}
          <div className="flex items-center justify-center sm:justify-start gap-2 border-b border-[var(--border-subtle)] pb-4 mb-4 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveCategory("ALL")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeCategory === "ALL"
                  ? "bg-[#D4AF37] text-[#08090D] shadow-md shadow-[#D4AF37]/20 font-bold"
                  : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              {t("hero.searchTabAll")}
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory("CAR_VAN")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeCategory === "CAR_VAN"
                  ? "bg-[#D4AF37] text-[#08090D] shadow-md shadow-[#D4AF37]/20 font-bold"
                  : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              {t("hero.searchTabCars")}
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory("LUXURY_WEDDING")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeCategory === "LUXURY_WEDDING"
                  ? "bg-[#D4AF37] text-[#08090D] shadow-md shadow-[#D4AF37]/20 font-bold"
                  : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {t("hero.searchTabLuxury")}
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory("MOTORBIKE")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeCategory === "MOTORBIKE"
                  ? "bg-[#D4AF37] text-[#08090D] shadow-md shadow-[#D4AF37]/20 font-bold"
                  : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              {t("hero.searchTabBikes")}
            </button>
          </div>

          {/* Dynamic Search Fields Form */}
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left"
          >
            {/* District / Destination */}
            <div className="flex flex-col bg-black/5 dark:bg-white/5 rounded-2xl p-3 border border-[var(--border-subtle)] hover:border-[var(--gold)] transition-colors">
              <label className="text-[10px] uppercase tracking-wider text-[var(--muted)] font-semibold flex items-center gap-1.5 mb-1">
                <MapPin className="w-3 h-3 text-[var(--gold)]" />
                Location / District
              </label>
              <input
                type="text"
                list="sri-lanka-districts"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder={t("hero.districtPlaceholder")}
                className="bg-transparent text-sm text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none w-full font-medium"
              />
              <datalist id="sri-lanka-districts">
                {districts.map((d) => (
                  <option key={d} value={d} />
                ))}
              </datalist>
            </div>

            {/* Pickup Date */}
            <div className="flex flex-col bg-black/5 dark:bg-white/5 rounded-2xl p-3 border border-[var(--border-subtle)] hover:border-[var(--gold)] transition-colors">
              <label className="text-[10px] uppercase tracking-wider text-[var(--muted)] font-semibold flex items-center gap-1.5 mb-1">
                <Calendar className="w-3 h-3 text-[var(--gold)]" />
                {t("hero.pickupDate")}
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent text-sm text-[var(--foreground)] focus:outline-none w-full font-medium"
              />
            </div>

            {/* Return Date */}
            <div className="flex flex-col bg-black/5 dark:bg-white/5 rounded-2xl p-3 border border-[var(--border-subtle)] hover:border-[var(--gold)] transition-colors">
              <label className="text-[10px] uppercase tracking-wider text-[var(--muted)] font-semibold flex items-center gap-1.5 mb-1">
                <Calendar className="w-3 h-3 text-[var(--gold)]" />
                {t("hero.returnDate")}
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent text-sm text-[var(--foreground)] focus:outline-none w-full font-medium"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full btn-gold h-full min-h-[50px] rounded-2xl flex items-center justify-center gap-2 text-sm font-bold shadow-lg"
              >
                <Search className="w-4 h-4" />
                <span>{t("hero.searchBtn")}</span>
              </button>
            </div>
          </form>

          {/* Trust Guarantee Micro-line */}
          <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-center gap-2 text-xs text-[var(--muted)]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--gold)]" />
            <span className="text-[var(--foreground)] font-semibold">{t("hero.verifiedBadge")}</span>
            <span className="hidden sm:inline opacity-30">•</span>
            <span className="hidden sm:inline">Zero Middleman Fraud</span>
            <span className="hidden sm:inline opacity-30">•</span>
            <span className="hidden sm:inline">Verified NIC/KYC Only</span>
          </div>
        </div>
      </div>
    </section>
  );
}
