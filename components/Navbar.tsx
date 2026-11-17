"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Home,
  Heart,
  CalendarDays,
  Timer,
  MapPin,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const navLinks = [
  { name: "Home", href: "#home", icon: Home },
  { name: "Story", href: "#story", icon: Heart },
  { name: "Wedding", href: "#wedding", icon: CalendarDays },
  { name: "Countdown", href: "#countdown", icon: Timer },
  { name: "Location", href: "#location", icon: MapPin },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const navRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  /* ----------------------------------------------------------------
     ENTRANCE ANIMATION (Top Bar + Bottom Nav)
  ----------------------------------------------------------------- */
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".nav-shell",
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 }
      )
        .fromTo(
          ".nav-logo",
          { y: -10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.75"
        )
        .fromTo(
          ".nav-link",
          { y: -10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, stagger: 0.06 },
          "-=0.5"
        )
        .fromTo(
          ".nav-cta",
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5 },
          "-=0.35"
        )
        // Bottom Nav Slide Up
        .fromTo(
          ".mobile-bottom-nav",
          { y: 100, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.2)" },
          "-=0.6"
        );
    },
    { scope: navRef, dependencies: [] }
  );

  /* ----------------------------------------------------------------
     SCROLL STATE + READING PROGRESS
  ----------------------------------------------------------------- */
  useGSAP(
    () => {
      const trigger = ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top -20",
        onEnter: () => setIsScrolled(true),
        onLeaveBack: () => setIsScrolled(false),
      });

      if (progressRef.current) {
        const progress = gsap.to(progressRef.current, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.4,
          },
        });

        return () => {
          trigger.kill();
          progress.scrollTrigger?.kill();
          progress.kill();
        };
      }

      return () => {
        trigger.kill();
      };
    },
    { scope: navRef, dependencies: [] }
  );

  /* ----------------------------------------------------------------
     ACTIVE SECTION TRACKING
  ----------------------------------------------------------------- */
  useEffect(() => {
    const sections = navLinks
      .map((link) => document.querySelector(link.href))
      .filter(Boolean) as Element[];

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header
        ref={navRef}
        className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8"
      >
        {/* Reading progress bar */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px]">
          <span
            ref={progressRef}
            className="block h-full w-full origin-left scale-x-0 bg-gradient-to-r from-[#D4AF37] via-[#E8D9A9] to-[#B89546]"
          />
        </div>

        {/* ================= TOP NAV SHELL ================= */}
        <div
          className={`nav-shell relative mx-auto flex max-w-[1240px] items-center justify-center gap-4 rounded-full border px-3 py-2.5 transition-all duration-500 sm:px-4 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:justify-between ${
            isScrolled
              ? "border-[#D4AF37]/30 bg-[#FAF9F6]/90 shadow-[0_16px_50px_-18px_rgba(0,0,0,0.28)] backdrop-blur-xl"
              : "border-[#D4AF37]/20 bg-[#FAF9F6]/60 shadow-[0_8px_30px_-16px_rgba(0,0,0,0.16)] backdrop-blur-md"
          }`}
        >
          {/* ---------------- LOGO (A&B Hidden on Mobile) ---------------- */}
          <Link
            href="#home"
            className="nav-logo group flex items-center gap-3 pl-1 lg:justify-self-start"
          >
            {/* A&B Circle - Hidden on Mobile */}
            <span className="relative hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-gradient-to-br from-[#D4AF37]/20 via-transparent to-[#D4AF37]/10 transition-all duration-500 group-hover:border-[#B89546] group-hover:from-[#D4AF37]/30 lg:flex">
              <span className="font-(family-name:--font-cormorant) text-[15px] font-semibold leading-none tracking-wide text-[#B89546]">
                A
                <span className="mx-0.5 font-(family-name:--font-great-vibes) text-[12px] font-normal text-[#A8A8A8]">
                  &
                </span>
                B
              </span>
            </span>

            {/* Together Forever Text (Centered on Mobile, Left on Desktop) */}
            <span className="flex flex-col items-center leading-none lg:items-start">
              <span className="font-(family-name:--font-montserrat) text-[8px] font-semibold uppercase tracking-[0.32em] text-[#8A8A8A]">
                Together
              </span>
              <span className="mt-1.5 font-(family-name:--font-great-vibes) text-[20px] leading-none text-[#B89546] lg:text-[18px]">
                Forever
              </span>
            </span>
          </Link>

          {/* ---------------- DESKTOP NAV ---------------- */}
          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 rounded-full border border-[#D4AF37]/15 bg-white/50 p-1 lg:flex lg:justify-self-center"
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeSection === link.href.replace("#", "");

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`nav-link group relative flex items-center gap-2 rounded-full px-4 py-2.5 transition-all duration-300 ${
                    isActive
                      ? "bg-[#B89546]/12 text-[#987A3F]"
                      : "text-[#4A4A4A] hover:bg-[#D4AF37]/10 hover:text-[#B89546]"
                  }`}
                >
                  <Icon
                    size={14}
                    strokeWidth={1.6}
                    className={`transition-transform duration-300 group-hover:-translate-y-0.5 ${
                      isActive ? "text-[#B89546]" : "text-[#C6A45C]"
                    }`}
                  />
                  <span className="font-(family-name:--font-montserrat) text-[10px] font-medium uppercase tracking-[0.14em]">
                    {link.name}
                  </span>

                  <span
                    className={`absolute bottom-1 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-[#B89546] transition-all duration-400 ${
                      isActive ? "w-4 opacity-100" : "w-0 opacity-0"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* ---------------- TOP CTA (Hidden on Mobile) ---------------- */}
          <Link
            href="#invitation"
            className="nav-cta group relative hidden items-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-[#B89546] via-[#C9A85F] to-[#B89546] px-5 py-3 text-white shadow-[0_10px_26px_-12px_rgba(184,149,70,0.95)] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-10px_rgba(184,149,70,0.95)] lg:flex lg:justify-self-end"
          >
            <Sparkles
              size={14}
              className="transition-transform duration-500 group-hover:rotate-12"
            />
            <span className="font-(family-name:--font-montserrat) text-[9px] font-semibold uppercase tracking-[0.2em]">
              Invitation
            </span>
            <ArrowUpRight
              size={13}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
          </Link>
        </div>
      </header>

      {/* ================= APP-LIKE BOTTOM NAVIGATION (Mobile Only) ================= */}
      <nav
        aria-label="Mobile Navigation"
        className="mobile-bottom-nav fixed bottom-0 left-0 right-0 z-50 border-t border-[#D4AF37]/20 bg-[#FAF9F6]/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.08)] backdrop-blur-xl lg:hidden"
      >
        <div className="flex h-[70px] items-center justify-around px-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeSection === link.href.replace("#", "");

            return (
              <Link
                key={link.name}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`group relative flex flex-col items-center justify-center gap-1.5 rounded-2xl px-4 py-2 transition-all duration-300 ${
                  isActive ? "text-[#B89546]" : "text-[#8A8A8A] hover:text-[#B89546]"
                }`}
              >
                {/* Active Background Highlight */}
                <span
                  className={`absolute inset-0 rounded-2xl bg-[#B89546]/10 transition-all duration-300 ${
                    isActive ? "scale-100 opacity-100" : "scale-75 opacity-0"
                  }`}
                />

                <Icon
                  size={20}
                  strokeWidth={isActive ? 2 : 1.5}
                  className={`relative z-10 transition-transform duration-300 ${
                    isActive ? "-translate-y-0.5 scale-110" : "group-hover:-translate-y-0.5"
                  }`}
                />

                <span
                  className={`relative z-10 font-(family-name:--font-montserrat) text-[9px] font-semibold uppercase tracking-widest transition-all duration-300 ${
                    isActive ? "opacity-100" : "opacity-70"
                  }`}
                >
                  {link.name}
                </span>

                {/* Active Indicator Dot */}
                <span
                  className={`absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#B89546] transition-all duration-300 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
