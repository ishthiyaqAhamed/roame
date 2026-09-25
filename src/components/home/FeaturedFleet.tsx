"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Star,
  MapPin,
  ShieldCheck,
  Fuel,
  Users,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export function FeaturedFleet() {
  const [filter, setFilter] = useState<string>("ALL");

  const sampleFleet = [
    {
      id: "v-1",
      category: "CAR_VAN",
      categoryName: "Cars & Vans",
      make: "Toyota",
      model: "WagonR Stingray Premium",
      year: 2022,
      plateNumber: "CBL-4589",
      district: "Colombo 07",
      city: "Cinnamon Gardens",
      pricePerDay: 7500,
      kmIncluded: "100 km/day included",
      fuelType: "Hybrid",
      transmission: "Automatic",
      seats: 4,
      rating: 4.95,
      reviewCount: 38,
      insuranceType: "COMPREHENSIVE",
      image:
        "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "v-2",
      category: "LUXURY_WEDDING",
      categoryName: "Luxury & Wedding",
      make: "Mercedes-Benz",
      model: "S-Class S350 Long Wheelbase",
      year: 2023,
      plateNumber: "CBM-9900",
      district: "Colombo",
      city: "Colombo 03",
      pricePerDay: 45000,
      kmIncluded: "Chauffeur + Floral Ribbon Suite",
      fuelType: "Petrol",
      transmission: "Automatic",
      seats: 4,
      rating: 5.0,
      reviewCount: 24,
      insuranceType: "COMPREHENSIVE",
      image:
        "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "v-3",
      category: "CAR_VAN",
      categoryName: "Cars & Vans",
      make: "Toyota",
      model: "HiAce KDH Super GL Luxury Van",
      year: 2021,
      plateNumber: "ND-3342",
      district: "Kandy",
      city: "Peradeniya",
      pricePerDay: 16500,
      kmIncluded: "150 km/day included",
      fuelType: "Diesel",
      transmission: "Automatic",
      seats: 10,
      rating: 4.92,
      reviewCount: 45,
      insuranceType: "COMPREHENSIVE",
      image:
        "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "v-4",
      category: "MOTORBIKE",
      categoryName: "Motorbikes & Scooters",
      make: "Piaggio",
      model: "Vespa Sprint 150 ABS",
      year: 2023,
      plateNumber: "BIE-2041",
      district: "Galle",
      city: "Unawatuna & Fort",
      pricePerDay: 3500,
      kmIncluded: "2 Sanitized Helmets Included",
      fuelType: "Petrol",
      transmission: "Automatic",
      seats: 2,
      rating: 4.98,
      reviewCount: 52,
      insuranceType: "COMPREHENSIVE",
      image:
        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "v-5",
      category: "LUXURY_WEDDING",
      categoryName: "Luxury & Wedding",
      make: "Rolls-Royce Classic / Vintage",
      model: "Silver Cloud Wedding Edition",
      year: 1965,
      plateNumber: "EN-1965",
      district: "Bentota & Galle Coast",
      city: "Bentota",
      pricePerDay: 65000,
      kmIncluded: "Uniformed Chauffeur + Ceremony Package",
      fuelType: "Petrol",
      transmission: "Manual",
      seats: 4,
      rating: 5.0,
      reviewCount: 19,
      insuranceType: "COMPREHENSIVE",
      image:
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "v-6",
      category: "MOTORBIKE",
      categoryName: "Motorbikes & Scooters",
      make: "Royal Enfield",
      model: "Himalayan 411cc Adventure",
      year: 2023,
      plateNumber: "BLA-9011",
      district: "Ella & Nuwara Eliya",
      city: "Ella Town",
      pricePerDay: 5800,
      kmIncluded: "Saddlebags + Dual Helmets",
      fuelType: "Petrol",
      transmission: "Manual",
      seats: 2,
      rating: 4.88,
      reviewCount: 31,
      insuranceType: "COMPREHENSIVE",
      image:
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const filteredFleet =
    filter === "ALL"
      ? sampleFleet
      : sampleFleet.filter((v) => v.category === filter);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-[var(--gold)] block mb-2">
            Verified Island Fleet
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[var(--foreground)] tracking-tight">
            Handpicked Vehicles Ready for Immediate Booking
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] overflow-x-auto">
          {["ALL", "CAR_VAN", "LUXURY_WEDDING", "MOTORBIKE"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filter === cat
                  ? "bg-[#D4AF37] text-[#08090D] font-bold shadow-sm"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {cat === "ALL"
                ? "All Vehicles"
                : cat === "CAR_VAN"
                ? "Cars & Vans"
                : cat === "LUXURY_WEDDING"
                ? "Luxury & Wedding"
                : "Motorbikes"}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Vehicles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredFleet.map((vehicle) => (
          <div
            key={vehicle.id}
            className="glass-card-gold rounded-3xl overflow-hidden flex flex-col group glass-card-hover"
          >
            {/* Image & Badges */}
            <div className="relative h-56 w-full overflow-hidden">
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${vehicle.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-black/30" />

              {/* Category Pill */}
              <div className="absolute top-4 left-4">
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#D4AF37]/30 text-[#F5E8BA]">
                  {vehicle.categoryName}
                </span>
              </div>

              {/* Comprehensive Insurance Guarantee Badge */}
              <div className="absolute top-4 right-4 bg-[#0A3A2F]/90 backdrop-blur-md border border-[#10B981]/30 text-[#6EE7B7] text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Comprehensive Insured</span>
              </div>

              {/* Location Badge */}
              <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-xs text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                <MapPin className="w-3 h-3 text-[#D4AF37]" />
                <span>{vehicle.district}</span>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="p-6 flex-1 flex flex-col justify-between bg-[var(--surface)]">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-serif-luxury text-xl font-bold text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors">
                      {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-[11px] text-[var(--muted)]">
                      {vehicle.year} • {vehicle.city}
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 bg-[var(--gold)]/10 px-2 py-1 rounded-lg border border-[var(--border-gold)]">
                    <Star className="w-3.5 h-3.5 text-[var(--gold)] fill-[var(--gold)]" />
                    <span className="text-xs font-bold text-[var(--gold)]">
                      {vehicle.rating}
                    </span>
                  </div>
                </div>

                {/* Specs Chips */}
                <div className="flex flex-wrap items-center gap-2 my-4 text-[11px] text-[var(--muted)]">
                  <span className="px-2.5 py-1 rounded-md bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)]">
                    {vehicle.transmission}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)]">
                    {vehicle.fuelType}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] flex items-center gap-1">
                    <Users className="w-3 h-3 text-[var(--gold)]" />
                    {vehicle.seats} Seats
                  </span>
                </div>

                {/* Package / Mileage included line */}
                <p className="text-xs text-[var(--gold)] font-semibold bg-[var(--gold)]/5 px-3 py-2 rounded-xl border border-[var(--border-gold)] mb-6">
                  {vehicle.kmIncluded}
                </p>
              </div>

              {/* Price & Booking Button */}
              <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[var(--muted)] block font-semibold">
                    Daily Rate
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-[var(--foreground)] font-serif-luxury">
                      LKR {vehicle.pricePerDay.toLocaleString()}
                    </span>
                    <span className="text-xs text-[var(--muted)]">/ day</span>
                  </div>
                </div>

                <Link
                  href={`/vehicles/${vehicle.id}`}
                  className="btn-gold text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-1.5 shadow-md"
                >
                  <span>Reserve</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
