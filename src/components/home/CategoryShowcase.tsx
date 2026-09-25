"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";
import { Car, Sparkles, Bike, ArrowUpRight, Check } from "lucide-react";

export function CategoryShowcase() {
  const { t } = useTranslation();

  const categories = [
    {
      id: "CAR_VAN",
      title: t("categories.carsTitle"),
      tagline: "Island Self-Drive & Group Vans",
      desc: t("categories.carsDesc"),
      icon: Car,
      image:
        "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
      features: [
        "Per-day & per-km mileage packages (e.g. 100km/day included)",
        "Fuel policy options (Full-to-full or owner-provided)",
        "WagonR, Vezel, Axio, KDH passenger vans",
        "Mandatory 4-side inspection handover log",
      ],
      priceStarts: "LKR 7,500 / day",
      link: "/vehicles?category=CAR_VAN",
      badge: "Self-Drive Freedom",
    },
    {
      id: "LUXURY_WEDDING",
      title: t("categories.luxuryTitle"),
      tagline: "Chauffeured Elegance & Ceremonies",
      desc: t("categories.luxuryDesc"),
      icon: Sparkles,
      image:
        "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
      features: [
        "Always driven by verified professional chauffeurs",
        "No renter driving license required (only Government NIC)",
        "Optional bespoke floral & ribbon decoration suite",
        "Mercedes S-Class, E-Class, Vintage Convertibles & Limousines",
      ],
      priceStarts: "LKR 35,000 / event",
      link: "/vehicles?category=LUXURY_WEDDING",
      badge: "VIP Chauffeur Included",
    },
    {
      id: "MOTORBIKE",
      title: t("categories.bikesTitle"),
      tagline: "Coastal Cruisers & Hill Trackers",
      desc: t("categories.bikesDesc"),
      icon: Bike,
      image:
        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80",
      features: [
        "Sanitized safety helmets included with every booking",
        "Engine capacity classes (A1 under 150cc & A touring)",
        "Honda Dio, Vespa Sprint, Yamaha FZ, Royal Enfield",
        "Daily & weekly adventure discounted packages",
      ],
      priceStarts: "LKR 2,500 / day",
      link: "/vehicles?category=MOTORBIKE",
      badge: "Helmets Included",
    },
  ];

  return (
    <section id="categories" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-[var(--gold)] block mb-2">
            Tailored Fleets
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)] tracking-tight">
            Curated For Every Island Occasion
          </h2>
        </div>
        <Link
          href="/vehicles"
          className="inline-flex items-center gap-2 text-sm text-[var(--gold)] hover:brightness-125 font-semibold transition-all"
        >
          <span>Explore All 25 Districts</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 3 Luxury Category Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              className="glass-card-gold rounded-3xl overflow-hidden flex flex-col group glass-card-hover"
            >
              {/* Image Preview Container */}
              <div className="relative h-60 w-full overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${cat.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-black/40" />

                {/* Badge Tag */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#D4AF37]/30 text-[#F5E8BA]">
                    <Icon className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {cat.badge}
                  </span>
                </div>

                {/* Starting Price Tag */}
                <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1 rounded-xl">
                  <span className="text-xs text-[#8E95A5]">From </span>
                  <span className="text-xs font-bold text-[#F3E5AB]">
                    {cat.priceStarts}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between bg-[var(--surface)]">
                <div>
                  <h3 className="font-serif-luxury text-2xl font-bold text-[var(--foreground)] mb-1">
                    {cat.title}
                  </h3>
                  <p className="text-xs font-semibold text-[var(--gold)] mb-3">
                    {cat.tagline}
                  </p>
                  <p className="text-xs text-[var(--foreground-muted)] leading-relaxed mb-6 font-normal">
                    {cat.desc}
                  </p>

                  {/* Highlights Bullet List */}
                  <ul className="space-y-2.5 mb-8">
                    {cat.features.map((feat, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-[var(--foreground-muted)] flex items-start gap-2.5"
                      >
                        <Check className="w-4 h-4 text-[var(--gold)] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Action Link */}
                <Link
                  href={cat.link}
                  className="w-full py-3 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-[#D4AF37] text-[var(--foreground)] hover:text-[#08090D] border border-[var(--border-subtle)] hover:border-[#D4AF37] text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300"
                >
                  <span>Browse {cat.title}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
