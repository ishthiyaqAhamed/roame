"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";
import { ShieldCheck, MapPin, Phone, Mail, Lock, Sparkles } from "lucide-react";

export function Footer() {
  const { t } = useTranslation();

  const districts = [
    "Colombo 01–15",
    "Galle & Unawatuna",
    "Kandy Hill Country",
    "Nuwara Eliya",
    "Bentota & Beruwala",
    "Mirissa & Weligama",
    "Ella & Badulla",
    "Sigiriya & Dambulla",
    "Negombo Beach",
    "Jaffna Peninsula",
  ];

  return (
    <footer className="bg-[var(--surface-raised)] border-t border-[var(--border-subtle)] pt-20 pb-12 relative overflow-hidden">
      {/* Subtle background ambient gold illumination */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-[var(--gold)]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#E6C86E] to-[#8C6B16] p-[1px]">
                <div className="w-full h-full bg-[#090A0F] rounded-[7px] flex items-center justify-center">
                  <span className="font-serif-luxury text-lg font-bold text-gold-gradient">
                    R
                  </span>
                </div>
              </div>
              <span className="font-serif-luxury text-2xl tracking-[0.2em] font-semibold text-[var(--foreground)]">
                ROAME
              </span>
            </Link>

            <p className="text-sm text-[var(--muted)] leading-relaxed max-w-sm font-normal">
              {t("footer.tagline")} Delivering an unmatched peer-to-peer automotive experience across Sri Lanka with mandatory comprehensive insurance and escrow protection.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-[var(--foreground-muted)] bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] rounded-full px-3.5 py-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>100% Comprehensive Coverage</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--foreground-muted)] bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] rounded-full px-3.5 py-1.5 font-medium">
                <Lock className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>Escrow Deposit Security</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold tracking-widest text-[var(--gold)] uppercase">
              Fleet Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-[var(--muted)]">
              <li>
                <Link href="/vehicles?category=CAR_VAN" className="hover:text-[var(--foreground)] transition-colors">
                  Self-Drive Cars & Sedans
                </Link>
              </li>
              <li>
                <Link href="/vehicles?category=CAR_VAN" className="hover:text-[var(--foreground)] transition-colors">
                  Passenger Vans (KDH / HiAce)
                </Link>
              </li>
              <li>
                <Link href="/vehicles?category=LUXURY_WEDDING" className="hover:text-[var(--foreground)] transition-colors">
                  Chauffeured Wedding Classics
                </Link>
              </li>
              <li>
                <Link href="/vehicles?category=LUXURY_WEDDING" className="hover:text-[var(--foreground)] transition-colors">
                  Executive Mercedes & BMW
                </Link>
              </li>
              <li>
                <Link href="/vehicles?category=MOTORBIKE" className="hover:text-[var(--foreground)] transition-colors">
                  Touring Bikes & Scooters
                </Link>
              </li>
            </ul>
          </div>

          {/* Island Coverage */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold tracking-widest text-[var(--gold)] uppercase">
              Popular Districts
            </h4>
            <div className="grid grid-cols-1 gap-1.5 text-xs text-[var(--muted)]">
              {districts.slice(0, 6).map((dist) => (
                <span key={dist} className="flex items-center gap-1.5 hover:text-[var(--foreground)] transition-colors">
                  <MapPin className="w-3 h-3 text-[var(--gold)]/70" />
                  {dist}
                </span>
              ))}
            </div>
          </div>

          {/* Concierge & Support */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold tracking-widest text-[var(--gold)] uppercase">
              Concierge & Trust
            </h4>
            <div className="space-y-2.5 text-xs text-[var(--muted)]">
              <p className="flex items-center gap-2 text-[var(--foreground)] font-medium">
                <Phone className="w-3.5 h-3.5 text-[var(--gold)]" />
                +94 11 700 8000
              </p>
              <p className="flex items-center gap-2 text-[var(--foreground)] font-medium">
                <Mail className="w-3.5 h-3.5 text-[var(--gold)]" />
                concierge@roame.lk
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1 text-[11px] text-[var(--gold)] bg-[var(--gold)]/10 border border-[var(--border-gold)] rounded-md px-2.5 py-1 font-semibold">
                  <Sparkles className="w-3 h-3 text-[var(--gold)]" />
                  24/7 Island Roadside Assist
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--border-subtle)] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--muted)]">
          <p>© {new Date().getFullYear()} Roame Sri Lanka. {t("footer.rights")}</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-[var(--foreground)] transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-[var(--foreground)] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/insurance-policy" className="hover:text-[var(--foreground)] transition-colors">
              Insurance & Excess Charter
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
