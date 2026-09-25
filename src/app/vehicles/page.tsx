"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Star,
  MapPin,
  ShieldCheck,
  Fuel,
  Users,
  Car,
  Sparkles,
  Bike,
  ArrowRight,
} from "lucide-react";

function VehiclesCatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "ALL";
  const initialDistrict = searchParams.get("district") || "";

  const [category, setCategory] = useState<string>(initialCategory);
  const [district, setDistrict] = useState<string>(initialDistrict);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [transmission, setTransmission] = useState<string>("ALL");
  const [priceRange, setPriceRange] = useState<number>(75000);

  const districts = [
    "All Districts",
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

  const fleet = [
    {
      id: "v-1",
      category: "CAR_VAN",
      categoryName: "Cars & Vans",
      make: "Toyota",
      model: "WagonR Stingray Premium",
      year: 2022,
      plateNumber: "CBL-4589",
      district: "Colombo",
      city: "Cinnamon Gardens, Colombo 07",
      pricePerDay: 7500,
      kmIncluded: "100 km/day included",
      fuelType: "Hybrid",
      transmission: "AUTOMATIC",
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
      transmission: "AUTOMATIC",
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
      transmission: "AUTOMATIC",
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
      kmIncluded: "2 Helmets Included",
      fuelType: "Petrol",
      transmission: "AUTOMATIC",
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
      district: "Bentota",
      city: "Bentota",
      pricePerDay: 65000,
      kmIncluded: "Uniformed Chauffeur + Ceremony Package",
      fuelType: "Petrol",
      transmission: "MANUAL",
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
      district: "Ella",
      city: "Ella Town",
      pricePerDay: 5800,
      kmIncluded: "Saddlebags + Dual Helmets",
      fuelType: "Petrol",
      transmission: "MANUAL",
      seats: 2,
      rating: 4.88,
      reviewCount: 31,
      insuranceType: "COMPREHENSIVE",
      image:
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const filtered = fleet.filter((item) => {
    if (category !== "ALL" && item.category !== category) return false;
    if (district && district !== "All Districts" && item.district !== district) return false;
    if (transmission !== "ALL" && item.transmission !== transmission) return false;
    if (item.pricePerDay > priceRange) return false;
    if (
      searchQuery &&
      !`${item.make} ${item.model} ${item.city}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-10">
        <span className="text-xs uppercase tracking-widest font-semibold text-[var(--gold)] block mb-2">
          Verified Sri Lankan Fleet
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)] tracking-tight">
          Explore Peer-to-Peer Vehicles
        </h1>
        <p className="text-sm text-[var(--foreground-muted)] mt-2 font-normal">
          Every vehicle is inspected and protected by mandatory comprehensive insurance.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-card-gold rounded-2xl p-4 sm:p-6 mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search Input */}
          <div className="flex flex-col">
            <label className="text-[10px] uppercase font-semibold text-[var(--muted)] mb-1">
              Search Make / Model
            </label>
            <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] rounded-xl px-3 py-2">
              <Search className="w-4 h-4 text-[var(--gold)]" />
              <input
                type="text"
                placeholder="e.g. WagonR, Mercedes, Vespa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs sm:text-sm text-[var(--foreground)] focus:outline-none w-full font-medium"
              />
            </div>
          </div>

          {/* District Dropdown */}
          <div className="flex flex-col">
            <label className="text-[10px] uppercase font-semibold text-[var(--muted)] mb-1">
              District
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="bg-[var(--surface)] text-xs sm:text-sm text-[var(--foreground)] border border-[var(--border-subtle)] rounded-xl px-3 py-2.5 focus:outline-none"
            >
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Transmission */}
          <div className="flex flex-col">
            <label className="text-[10px] uppercase font-semibold text-[var(--muted)] mb-1">
              Transmission
            </label>
            <select
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
              className="bg-[var(--surface)] text-xs sm:text-sm text-[var(--foreground)] border border-[var(--border-subtle)] rounded-xl px-3 py-2.5 focus:outline-none"
            >
              <option value="ALL">All Transmissions</option>
              <option value="AUTOMATIC">Automatic</option>
              <option value="MANUAL">Manual</option>
            </select>
          </div>

          {/* Price Range Slider */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] uppercase font-semibold text-[var(--muted)]">
                Max Price / Day
              </label>
              <span className="text-xs font-bold text-[var(--gold)]">
                LKR {priceRange.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="2000"
              max="100000"
              step="1000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="accent-[#D4AF37] h-2 bg-black/10 dark:bg-white/10 rounded-lg cursor-pointer mt-3"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 pt-3 border-t border-[var(--border-subtle)] overflow-x-auto">
          {[
            { id: "ALL", label: "All Vehicles", icon: Car },
            { id: "CAR_VAN", label: "Cars & Vans", icon: Car },
            { id: "LUXURY_WEDDING", label: "Luxury & Wedding", icon: Sparkles },
            { id: "MOTORBIKE", label: "Motorbikes & Scooters", icon: Bike },
          ].map((c) => {
            const Icon = c.icon;
            return (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  category === c.id
                    ? "bg-[#D4AF37] text-[#08090D] font-bold shadow-md shadow-[#D4AF37]/20"
                    : "text-[var(--muted)] hover:text-[var(--foreground)] bg-black/5 dark:bg-white/5"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs text-[var(--muted)]">
          Showing <strong className="text-[var(--foreground)]">{filtered.length}</strong> verified vehicles in Sri Lanka
        </span>
      </div>

      {/* Vehicles Grid */}
      {filtered.length === 0 ? (
        <div className="glass-card-gold rounded-3xl p-12 text-center">
          <p className="text-base text-[var(--foreground)] font-semibold mb-2">No vehicles found matching your filters</p>
          <p className="text-xs text-[var(--muted)] mb-6">Try resetting your district or price range filters</p>
          <button
            onClick={() => {
              setCategory("ALL");
              setDistrict("All Districts");
              setTransmission("ALL");
              setPriceRange(75000);
              setSearchQuery("");
            }}
            className="btn-gold text-xs px-4 py-2 rounded-xl"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((vehicle) => (
            <div
              key={vehicle.id}
              className="glass-card-gold rounded-3xl overflow-hidden flex flex-col group glass-card-hover"
            >
              {/* Image Preview */}
              <div className="relative h-56 w-full overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${vehicle.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-black/30" />

                <div className="absolute top-4 left-4">
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#D4AF37]/30 text-[#F5E8BA]">
                    {vehicle.categoryName}
                  </span>
                </div>

                <div className="absolute top-4 right-4 bg-[#0A3A2F]/90 backdrop-blur-md border border-[#10B981]/30 text-[#6EE7B7] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Comprehensive Insured</span>
                </div>

                <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-xs text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                  <MapPin className="w-3 h-3 text-[#D4AF37]" />
                  <span>{vehicle.district}</span>
                </div>
              </div>

              {/* Details */}
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

                    <div className="flex items-center gap-1 bg-[var(--gold)]/10 px-2 py-1 rounded-lg border border-[var(--border-gold)]">
                      <Star className="w-3.5 h-3.5 text-[var(--gold)] fill-[var(--gold)]" />
                      <span className="text-xs font-bold text-[var(--gold)]">
                        {vehicle.rating}
                      </span>
                    </div>
                  </div>

                  {/* Chips */}
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

                  <p className="text-xs text-[var(--gold)] font-semibold bg-[var(--gold)]/5 px-3 py-2 rounded-xl border border-[var(--border-gold)] mb-6">
                    {vehicle.kmIncluded}
                  </p>
                </div>

                {/* Price & Action */}
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
      )}
    </div>
  );
}

export default function VehiclesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 text-center text-[var(--muted)]">Loading vehicle catalog...</div>}>
      <VehiclesCatalogContent />
    </Suspense>
  );
}
