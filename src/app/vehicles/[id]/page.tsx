"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import {
  Star,
  MapPin,
  ShieldCheck,
  Fuel,
  Users,
  Calendar,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Car,
  Camera,
  AlertCircle,
  Lock,
} from "lucide-react";

interface PageParams {
  params: Promise<{ id: string }>;
}

export default function VehicleDetailPage({ params }: PageParams) {
  const resolvedParams = use(params);
  const vehicleId = resolvedParams.id;

  const [startDate, setStartDate] = useState<string>("2026-10-01");
  const [endDate, setEndDate] = useState<string>("2026-10-04");
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);

  // Sample luxury vehicle data matching Sri Lankan catalog
  const vehicle = {
    id: vehicleId,
    make: "Mercedes-Benz",
    model: "S-Class S350 Long Wheelbase",
    year: 2023,
    category: "LUXURY_WEDDING",
    plateNumber: "CBM-9900",
    district: "Colombo",
    city: "Colombo 03 (Kollupitiya / Galle Face)",
    pricePerDay: 45000,
    securityDeposit: 30000,
    kmIncluded: "Chauffeur + Floral Ribbon Suite",
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 4,
    rating: 5.0,
    reviewCount: 24,
    insuranceType: "COMPREHENSIVE",
    insuranceExpiry: "2027-04-15",
    photos: [
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    ],
    owner: {
      fullName: "Dinesh Karunaratne",
      role: "Verified Premium Host",
      memberSince: "2024",
      responseRate: "100%",
      responseTime: "Within 30 minutes",
    },
    specs: [
      { label: "Category", value: "Luxury & Wedding" },
      { label: "Chauffeur", value: "Included (Professional Uniformed)" },
      { label: "Fuel Policy", value: "Owner Provides" },
      { label: "Decorations", value: "Wedding Floral & Satin Ribbons" },
      { label: "Min Booking", value: "4 Hours" },
      { label: "Insurance", value: "100% Comprehensive Protected" },
    ],
  };

  // Calculations
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  const rentalTotal = diffDays * vehicle.pricePerDay;
  const grandTotal = rentalTotal + vehicle.securityDeposit;

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingLoading(true);
    setTimeout(() => {
      setBookingLoading(false);
      setBookingSuccess(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Back Link */}
      <Link
        href="/vehicles"
        className="inline-flex items-center gap-2 text-xs text-[#8E95A5] hover:text-[#D4AF37] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Fleet Catalog</span>
      </Link>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 Cols: Gallery, Specs, Trust Policy */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Main Gallery */}
          <div className="glass-card-gold rounded-3xl overflow-hidden p-2">
            <div
              className="h-80 sm:h-96 w-full rounded-2xl bg-cover bg-center"
              style={{ backgroundImage: `url('${vehicle.photos[0]}')` }}
            />
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div
                className="h-32 rounded-xl bg-cover bg-center"
                style={{ backgroundImage: `url('${vehicle.photos[1]}')` }}
              />
              <div
                className="h-32 rounded-xl bg-cover bg-center"
                style={{ backgroundImage: `url('${vehicle.photos[2]}')` }}
              />
            </div>
          </div>

          {/* Title and Specs Header */}
          <div className="glass-card-gold rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#F3E5AB] border border-[#D4AF37]/30">
                    Luxury & Wedding
                  </span>
                  <div className="bg-[#0A3A2F]/90 text-[#6EE7B7] text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-[#10B981]/30">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Comprehensive Insured</span>
                  </div>
                </div>
                <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white">
                  {vehicle.make} {vehicle.model} ({vehicle.year})
                </h1>
                <p className="text-xs text-[#8E95A5] flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {vehicle.city} • Plate: {vehicle.plateNumber}
                </p>
              </div>

              {/* Rating */}
              <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1">
                <div className="flex items-center gap-1 bg-[#D4AF37]/10 px-3 py-1.5 rounded-xl border border-[#D4AF37]/25">
                  <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                  <span className="text-sm font-bold text-[#F3E5AB]">{vehicle.rating}</span>
                </div>
                <span className="text-[11px] text-[#8E95A5]">{vehicle.reviewCount} verified reviews</span>
              </div>
            </div>

            {/* Specs Grid */}
            <h3 className="text-xs uppercase tracking-widest font-semibold text-[#D4AF37] mb-4">
              Vehicle Specifications & Amenities
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              {vehicle.specs.map((s, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-[#8E95A5] uppercase block">{s.label}</span>
                  <span className="text-xs font-semibold text-white">{s.value}</span>
                </div>
              ))}
            </div>

            {/* 4-Angle Handover Guarantee Notice */}
            <div className="p-4 rounded-2xl bg-[#D4AF37]/5 border border-[#D4AF37]/20 flex items-start gap-3">
              <Camera className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-[#F3E5AB]">
                  Roame 4-Angle Digital Handover Guarantee
                </h4>
                <p className="text-xs text-[#8E95A5] mt-1 leading-relaxed">
                  Before driving off, you and the owner will photograph the 4 corners of this vehicle and confirm odometer/fuel on the Roame app. Your security deposit is held safely in escrow and released upon return.
                </p>
              </div>
            </div>
          </div>

          {/* Owner Card */}
          <div className="glass-card-gold rounded-3xl p-6 sm:p-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-xl font-bold text-gold-gradient font-serif-luxury">
                DK
              </div>
              <div>
                <h4 className="text-base font-bold text-white">{vehicle.owner.fullName}</h4>
                <p className="text-xs text-[#D4AF37]">{vehicle.owner.role}</p>
                <p className="text-[11px] text-[#8E95A5] mt-0.5">
                  Response rate: {vehicle.owner.responseRate} • {vehicle.owner.responseTime}
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#6EE7B7] bg-[#0A3A2F] px-3 py-1.5 rounded-full border border-[#10B981]/30 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Identity Verified</span>
            </div>
          </div>
        </div>

        {/* Right Col: Instant Booking & Escrow Calculator */}
        <div className="flex flex-col gap-6">
          <div className="glass-card-gold rounded-3xl p-6 sm:p-8 sticky top-28">
            <div className="border-b border-white/10 pb-6 mb-6">
              <span className="text-xs text-[#8E95A5] uppercase font-semibold">Rental Price</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-bold text-white font-serif-luxury">
                  LKR {vehicle.pricePerDay.toLocaleString()}
                </span>
                <span className="text-xs text-[#8E95A5]">/ day</span>
              </div>
            </div>

            {bookingSuccess ? (
              <div className="p-6 rounded-2xl bg-[#0A3A2F]/90 border border-[#10B981]/40 text-center flex flex-col items-center">
                <CheckCircle2 className="w-10 h-10 text-[#10B981] mb-3" />
                <h3 className="text-base font-bold text-white mb-1">Booking Request Submitted!</h3>
                <p className="text-xs text-[#C4C8D4] leading-relaxed mb-4">
                  The host has been notified and has <strong>6 hours</strong> to accept. Your security deposit is secured in escrow.
                </p>
                <Link
                  href="/vehicles"
                  className="btn-gold text-xs px-4 py-2 rounded-xl font-bold"
                >
                  Browse More Fleet
                </Link>
              </div>
            ) : (
              <form onSubmit={handleBook} className="space-y-4">
                {/* Dates */}
                <div>
                  <label className="text-[10px] uppercase font-semibold text-[#8E95A5] block mb-1">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-semibold text-[#8E95A5] block mb-1">
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                {/* Price Breakdown */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 text-xs">
                  <div className="flex justify-between text-[#8E95A5]">
                    <span>LKR {vehicle.pricePerDay.toLocaleString()} × {diffDays} days</span>
                    <span className="text-white font-medium">LKR {rentalTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[#8E95A5]">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-[#D4AF37]" />
                      Escrow Deposit (Refundable)
                    </span>
                    <span className="text-[#F3E5AB] font-medium">
                      LKR {vehicle.securityDeposit.toLocaleString()}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold text-white">
                    <span>Total Hold</span>
                    <span className="text-gold-gradient font-serif-luxury text-base">
                      LKR {grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* 6-hour response guarantee */}
                <div className="flex items-center gap-2 text-[11px] text-[#8E95A5] pt-1">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Host has a 6-hour deadline to accept or auto-decline</span>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full btn-gold py-3.5 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2"
                >
                  {bookingLoading ? (
                    <span>Processing Escrow Hold...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Request Booking</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
