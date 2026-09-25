"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation, Locale } from "@/lib/i18n/context";
import { ShieldCheck, Globe, Menu, X, Car, Key, UserCheck } from "lucide-react";

export function Navbar() {
  const { t, locale, setLocale } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const languages: { code: Locale; label: string; native: string }[] = [
    { code: "en", label: "English", native: "English" },
    { code: "si", label: "Sinhala", native: "සිංහල" },
    { code: "ta", label: "Tamil", native: "தமிழ்" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#08090D]/85 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Monogram & Wordmark */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E6C86E] via-[#D4AF37] to-[#8C6B16] flex items-center justify-center p-[1px] shadow-lg shadow-[#D4AF37]/20 group-hover:shadow-[#D4AF37]/40 transition-all">
            <div className="w-full h-full bg-[#090A0F] rounded-[11px] flex items-center justify-center">
              <span className="font-serif-luxury text-xl font-bold text-gold-gradient">
                R
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-serif-luxury text-2xl tracking-[0.18em] font-semibold text-white group-hover:text-[#F3E5AB] transition-colors">
              ROAME
            </span>
            <span className="text-[9px] tracking-[0.25em] text-[#8E95A5] -mt-1 uppercase">
              Ceylon Collective
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/vehicles"
            className="text-sm text-[#C4C8D4] hover:text-[#D4AF37] transition-colors font-medium flex items-center gap-1.5"
          >
            <Car className="w-4 h-4 text-[#D4AF37]/80" />
            {t("nav.explore")}
          </Link>
          <Link
            href="#categories"
            className="text-sm text-[#C4C8D4] hover:text-[#D4AF37] transition-colors font-medium"
          >
            {t("nav.categories")}
          </Link>
          <Link
            href="#trust"
            className="text-sm text-[#C4C8D4] hover:text-[#D4AF37] transition-colors font-medium flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            {t("nav.howItWorks")}
          </Link>
          <Link
            href="/host"
            className="text-sm text-[#F3E5AB] hover:text-[#D4AF37] transition-colors font-medium flex items-center gap-1.5"
          >
            <Key className="w-3.5 h-3.5 text-[#D4AF37]" />
            {t("nav.listVehicle")}
          </Link>
        </nav>

        {/* Action Controls & Language Switcher */}
        <div className="hidden md:flex items-center gap-4">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-[#C4C8D4] transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="uppercase">{locale}</span>
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 py-1.5 rounded-xl bg-[#10121A] border border-[#D4AF37]/25 shadow-2xl z-50 backdrop-blur-2xl">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLocale(lang.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-white/5 transition-colors ${
                      locale === lang.code
                        ? "text-[#D4AF37] font-semibold"
                        : "text-[#C4C8D4]"
                    }`}
                  >
                    <span>{lang.native}</span>
                    <span className="text-[10px] text-[#8E95A5] uppercase">
                      {lang.code}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sign In & Join CTAs */}
          <Link
            href="/auth/login"
            className="text-xs font-medium text-[#C4C8D4] hover:text-white px-3.5 py-2 transition-colors"
          >
            {t("nav.login")}
          </Link>

          <Link
            href="/auth/register"
            className="btn-gold text-xs px-4 py-2 rounded-lg font-medium flex items-center gap-1.5"
          >
            <UserCheck className="w-3.5 h-3.5" />
            {t("nav.register")}
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/5 text-[#C4C8D4] hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F1118]/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6 flex flex-col gap-4">
          <Link
            href="/vehicles"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base text-[#F5F6FA] py-2 border-b border-white/5 font-medium"
          >
            {t("nav.explore")}
          </Link>
          <Link
            href="#categories"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base text-[#F5F6FA] py-2 border-b border-white/5 font-medium"
          >
            {t("nav.categories")}
          </Link>
          <Link
            href="#trust"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base text-[#F5F6FA] py-2 border-b border-white/5 font-medium"
          >
            {t("nav.howItWorks")}
          </Link>
          <Link
            href="/host"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base text-[#D4AF37] py-2 border-b border-white/5 font-medium"
          >
            {t("nav.listVehicle")}
          </Link>

          {/* Language selection in mobile */}
          <div className="flex items-center gap-2 pt-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLocale(lang.code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                  locale === lang.code
                    ? "bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]"
                    : "bg-white/5 border-white/10 text-[#8E95A5]"
                }`}
              >
                {lang.native}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-4">
            <Link
              href="/auth/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2.5 rounded-lg bg-white/5 text-sm font-medium text-white border border-white/10"
            >
              {t("nav.login")}
            </Link>
            <Link
              href="/auth/register"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2.5 rounded-lg btn-gold text-sm font-semibold"
            >
              {t("nav.register")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
