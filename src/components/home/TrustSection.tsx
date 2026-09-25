"use client";

import React from "react";
import { useTranslation } from "@/lib/i18n/context";
import { ShieldAlert, Camera, UserCheck, LockKeyhole, FileCheck, CheckCircle, Scale } from "lucide-react";

export function TrustSection() {
  const { t } = useTranslation();

  const pillars = [
    {
      icon: ShieldAlert,
      tag: "API-Level Rule",
      title: t("valueProps.prop1Title"),
      desc: t("valueProps.prop1Desc"),
      detail:
        "Third-party-only insurance policies are rejected by our listing engine. In any accidental damage, the owner's comprehensive insurer covers the bulk; renters only pay the defined excess deductible.",
    },
    {
      icon: Camera,
      tag: "Dual Verification",
      title: t("valueProps.prop2Title"),
      desc: t("valueProps.prop2Desc"),
      detail:
        "At handover, both parties capture front, rear, driver-side, and passenger-side high-res photos plus fuel gauge & odometer reading. Both parties sign off digitally on the app.",
    },
    {
      icon: UserCheck,
      tag: "Strict KYC",
      title: t("valueProps.prop3Title"),
      desc: t("valueProps.prop3Desc"),
      detail:
        "Every customer must submit Government NIC and Driving License front & back photos. Bookings are strictly disabled until human compliance officers approve the profile.",
    },
    {
      icon: LockKeyhole,
      tag: "Escrow Protection",
      title: t("valueProps.prop4Title"),
      desc: t("valueProps.prop4Desc"),
      detail:
        "Security deposits are placed on hold in secure digital escrow. The moment a return inspection is mutually confirmed with no damage, the deposit hold is immediately released.",
    },
  ];

  return (
    <section id="trust" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-72 bg-[#D4AF37]/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs font-semibold text-[#F3E5AB] mb-4">
          <Scale className="w-3.5 h-3.5 text-[#D4AF37]" />
          {t("valueProps.tag")}
        </span>
        <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
          {t("valueProps.title")}
        </h2>
        <p className="text-sm sm:text-base text-[#8E95A5]">
          Roame is built from the ground up as a trusted mediator. We engineer safety directly into our software, protecting both Sri Lankan vehicle owners and travelers.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <div
              key={idx}
              className="glass-card-gold rounded-3xl p-8 flex flex-col justify-between glass-card-hover"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-black border border-[#D4AF37]/40 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/20">
                    {pillar.tag}
                  </span>
                </div>

                <h3 className="font-serif-luxury text-2xl font-bold text-white mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs text-[#C4C8D4] leading-relaxed mb-4 font-normal">
                  {pillar.desc}
                </p>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-[#8E95A5] leading-relaxed">
                  {pillar.detail}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
