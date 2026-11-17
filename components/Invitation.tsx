"use client";

import { useRef } from "react";
import { Heart, Sparkles } from "lucide-react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useWedding } from "@/components/WeddingProvider";
import type { WeddingInfo } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

interface InvitationProps {
  greeting?: string;
  wedding?: WeddingInfo;
  personalized?: boolean;
}

export default function Invitation({
  greeting,
  wedding: invitationWedding,
  personalized = false,
}: InvitationProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const homepageWedding = useWedding();
  const wedding = invitationWedding ?? homepageWedding;
  const weddingDate = wedding ? new Date(`${wedding.weddingDate}T00:00:00`) : null;

  useGSAP(
    () => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });

      // Card Reveal
      timeline.fromTo(
        ".invitation-card",
        { opacity: 0, y: 80, scale: 0.95, rotateX: 10, transformPerspective: 1000 },
        { opacity: 1, y: 0, scale: 1, rotateX: 0, duration: 1.4, ease: "power4.out" }
      )
      // Floral SVGs Draw/Fade In
      .fromTo(
        ".floral-svg",
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1.2, stagger: 0.2, ease: "power3.out" },
        "-=1"
      )
      // Text Stagger Reveal
      .fromTo(
        ".invitation-text",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" },
        "-=0.8"
      )
      // Monogram Reveal
      .fromTo(
        ".monogram",
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.5)" },
        "-=0.6"
      );

      gsap.to(".invitation-floating-heart", {
        y: -8,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="invitation"
      className="relative overflow-hidden bg-[#FDFBF7] px-4 py-24 md:px-10 md:py-32"
    >
      {/* ================= LUXURY PATTERN BACKGROUND ================= */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%238C7355' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M60 10 C70 30 90 40 60 60 C30 40 50 30 60 10 Z'/%3E%3Cpath d='M60 110 C50 90 30 80 60 60 C90 80 70 90 60 110 Z'/%3E%3Cpath d='M10 60 C30 50 40 30 60 60 C40 90 30 70 10 60 Z'/%3E%3Cpath d='M110 60 C90 70 80 90 60 60 C80 30 90 50 110 60 Z'/%3E%3Ccircle cx='60' cy='60' r='4' fill='%238C7355'/%3E%3Ccircle cx='0' cy='0' r='4' fill='%238C7355'/%3E%3Ccircle cx='120' cy='0' r='4' fill='%238C7355'/%3E%3Ccircle cx='0' cy='120' r='4' fill='%238C7355'/%3E%3Ccircle cx='120' cy='120' r='4' fill='%238C7355'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px"
        }}
      />

      {/* Background Glows */}
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-[#D4AF37]/10 blur-[110px]" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-[#D4AF37]/10 blur-[110px]" />

      {/* Section Intro */}
      <div className="relative z-10 mx-auto mb-16 max-w-3xl text-center">
        <div className="mb-6 flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#8C7355]" />
          <Sparkles size={16} className="text-[#8C7355]" strokeWidth={1.4} />
          <span className="font-(family-name:--font-montserrat) text-[10px] font-semibold uppercase tracking-[0.4em] text-[#8C7355]">
            A Special Invitation
          </span>
          <Sparkles size={16} className="text-[#8C7355]" strokeWidth={1.4} />
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#8C7355]" />
        </div>

        <h2 className="font-(family-name:--font-cormorant) text-5xl font-medium text-[#222222] md:text-7xl">
          You&apos;re Invited<span className="italic text-[#B79A50]">!</span>
        </h2>

        <p className="mx-auto mt-5 max-w-lg font-(family-name:--font-montserrat) text-xs leading-7 text-[#777777] md:text-sm">
          A celebration of love, a promise of forever, and a day we would love to share with you.
        </p>
      </div>

      {/* ================= INVITATION CARD ================= */}
      <div className="invitation-card relative mx-auto max-w-[650px] shadow-[0_30px_80px_-20px_rgba(90,70,30,0.25)]">

        {/* Paper Texture Background */}
        <div
          className="absolute inset-0 z-0 bg-[#F6F2EB]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`
          }}
        />

        {/* Deckled Edge Effect (Simulated with borders) */}
        <div className="absolute inset-0 border border-[#D4AF37]/20 m-1 pointer-events-none z-10" />

        <div className="relative z-20 px-6 py-16 sm:px-12 sm:py-20 md:px-16 md:py-24">

          {/* Ornate Inner Frame (SVG) */}
          <svg className="pointer-events-none absolute inset-2 h-[calc(100%-16px)] w-[calc(100%-16px)] text-[#D4AF37]/40" viewBox="0 0 100 140" preserveAspectRatio="none">
            <path
              d="M5,15 L15,5 L85,5 L95,15 L95,125 L85,135 L15,135 L5,125 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            {/* Decorative inner line */}
            <path
              d="M8,18 L18,8 L82,8 L92,18 L92,122 L82,132 L18,132 L8,122 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.2"
            />
          </svg>

          {/* ================= FLORAL DECORATIONS ================= */}
          {/* Top Left Flower (Peony) */}
          <div className="floral-svg pointer-events-none absolute -left-4 -top-6 w-32 text-[#8C7355] opacity-70 sm:w-48 md:-left-8 md:-top-8">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 120 C80 140 40 150 20 120 C0 90 30 60 60 50 C90 40 120 60 130 80 C140 100 120 110 100 120 Z" stroke="currentColor" strokeWidth="1" />
              <path d="M60 50 C50 20 80 10 100 20 C120 10 150 20 140 50 C130 80 100 100 100 120 C100 100 70 80 60 50 Z" stroke="currentColor" strokeWidth="1" />
              <path d="M20 120 C10 140 30 160 50 150 C70 160 90 150 100 120 C90 140 50 150 20 120 Z" stroke="currentColor" strokeWidth="1" />
              <path d="M130 80 C150 90 170 130 140 150 C120 170 100 160 100 120 C110 140 120 110 130 80 Z" stroke="currentColor" strokeWidth="1" />
              <path d="M100 120 C80 130 60 170 80 190 C100 200 120 190 130 160 C120 150 110 130 100 120 Z" stroke="currentColor" strokeWidth="1" />
              <path d="M80 190 C60 200 40 180 50 160" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              <path d="M130 160 C150 170 170 150 160 130" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </div>

          {/* Bottom Right Flower (Hibiscus) */}
          <div className="floral-svg pointer-events-none absolute -bottom-8 -right-4 w-32 text-[#8C7355] opacity-70 sm:w-48 md:-bottom-10 md:-right-8">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 20 C120 0 160 20 150 50 C140 80 110 100 100 120 C90 100 60 80 50 50 C40 20 80 0 100 20 Z" stroke="currentColor" strokeWidth="1" />
              <path d="M100 120 C80 140 40 150 20 120 C0 90 30 60 60 50 C90 40 120 60 130 80 C140 100 120 110 100 120 Z" stroke="currentColor" strokeWidth="1" />
              <path d="M100 120 C120 140 160 150 180 120 C200 90 170 60 140 50 C110 40 80 60 70 80 C60 100 80 110 100 120 Z" stroke="currentColor" strokeWidth="1" />
              <path d="M100 120 C80 140 60 180 80 200 C100 210 120 200 130 170 C120 150 110 130 100 120 Z" stroke="currentColor" strokeWidth="1" />
              <path d="M140 50 C160 30 190 50 180 80" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              <path d="M60 50 C40 30 10 50 20 80" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </div>

          {/* ================= CARD CONTENT ================= */}
          <div className="relative z-30 flex flex-col items-center text-center">

            {/* Monogram */}
            <div className="monogram mb-8 flex flex-col items-center text-[#5C4A3D]">
              {/* Ornate Top Flourish */}
              <svg width="40" height="20" viewBox="0 0 40 20" fill="none" className="mb-1 text-[#B79A50]">
                <path d="M20 20 C15 15 5 10 0 15 C5 5 15 5 20 10 C25 5 35 5 40 15 C35 10 25 15 20 20 Z" fill="currentColor" />
                <circle cx="20" cy="5" r="2" fill="currentColor" />
              </svg>

              <div className="flex items-center gap-3">
                <span className="font-(family-name:--font-cormorant) text-4xl font-medium tracking-widest">
                  {wedding?.groomName.charAt(0) || "G"}
                </span>
                <span className="h-8 w-px bg-[#B79A50]"></span>
                <span className="font-(family-name:--font-cormorant) text-4xl font-medium tracking-widest">
                  {wedding?.brideName.charAt(0) || "B"}
                </span>
              </div>

              {/* Ornate Bottom Flourish */}
              <svg width="40" height="20" viewBox="0 0 40 20" fill="none" className="mt-1 rotate-180 text-[#B79A50]">
                <path d="M20 20 C15 15 5 10 0 15 C5 5 15 5 20 10 C25 5 35 5 40 15 C35 10 25 15 20 20 Z" fill="currentColor" />
                <circle cx="20" cy="5" r="2" fill="currentColor" />
              </svg>
            </div>

            {personalized && greeting && (
              <p className="invitation-text mb-5 font-(family-name:--font-cormorant) text-2xl italic text-[#4A4036] md:text-3xl">
                {greeting}
              </p>
            )}

            {/* Together with families */}
            <p className="invitation-text font-(family-name:--font-montserrat) text-[9px] font-semibold uppercase tracking-[0.4em] text-[#8A7A56]">
              Together with their families
            </p>

            {/* Couple Names */}
            <div className="invitation-text mt-6 flex flex-col items-center text-[#4A4036]">
              <h3 className="font-(family-name:--font-cormorant) text-4xl uppercase tracking-[0.15em] sm:text-5xl md:text-6xl">
                {wedding?.groomName || "The Groom"}
              </h3>

              <div className="my-2 flex items-center gap-4">
                <span className="h-px w-8 bg-[#D4AF37]/50" />
                <span className="font-(family-name:--font-great-vibes) text-3xl text-[#B79A50]">
                  and
                </span>
                <span className="h-px w-8 bg-[#D4AF37]/50" />
              </div>

              <h3 className="font-(family-name:--font-cormorant) text-4xl uppercase tracking-[0.15em] sm:text-5xl md:text-6xl">
                {wedding?.brideName || "The Bride"}
              </h3>
            </div>

            {/* Invite Text */}
            <p className="invitation-text mt-6 font-(family-name:--font-montserrat) text-[9px] font-semibold uppercase tracking-[0.4em] text-[#8A7A56]">
              Invite you to their wedding
            </p>

            {/* Date Block */}
            <div className="invitation-text mt-8 flex w-full max-w-sm flex-col items-center">
              <p className="font-(family-name:--font-montserrat) text-[10px] font-semibold uppercase tracking-[0.3em] text-[#8A7A56]">
                {weddingDate?.toLocaleDateString("en", { month: "long" }) ?? "Date to follow"}
              </p>

              <div className="my-3 flex w-full items-center justify-center gap-6 sm:gap-10">
                {/* Left Side */}
                <div className="flex flex-1 flex-col items-end">
                  <span className="font-(family-name:--font-montserrat) text-[8px] font-semibold uppercase tracking-[0.2em] text-[#8A7A56]">
                    {weddingDate?.toLocaleDateString("en", { weekday: "long" }) ?? ""}
                  </span>
                </div>

                {/* Center Date */}
                <div className="border-x border-[#D4AF37]/50 px-6 py-1">
                  <p className="font-(family-name:--font-cormorant) text-5xl font-medium leading-none text-[#2A2A2A] sm:text-6xl">
                    {weddingDate?.toLocaleDateString("en", { day: "numeric" }) ?? "—"}
                  </p>
                </div>

                {/* Right Side */}
                <div className="flex flex-1 flex-col items-start">
                  <span className="font-(family-name:--font-montserrat) text-[8px] font-semibold uppercase tracking-[0.2em] text-[#8A7A56]">
                    {weddingDate?.toLocaleDateString("en", { year: "numeric" }) ?? ""}
                  </span>
                </div>
              </div>

              <p className="mt-3 font-(family-name:--font-montserrat) text-[9px] font-semibold uppercase tracking-[0.3em] text-[#8A7A56]">
                {wedding?.weddingTime || "Time to be announced"}
              </p>
            </div>

            {/* Venue */}
            <div className="invitation-text mt-8 flex flex-col items-center">
              <p className="font-(family-name:--font-cormorant) text-2xl font-semibold uppercase tracking-widest text-[#4A4036] md:text-3xl">
                {wedding?.venueName || "Venue to be announced"}
              </p>
              <p className="mt-2 font-(family-name:--font-montserrat) text-[9px] font-medium uppercase tracking-[0.3em] text-[#8A7A56]">
                {wedding?.venueAddress || ""}
              </p>
            </div>

            {/* Bottom Script */}
            <div className="invitation-text mt-10 flex flex-col items-center">
              <p className="font-(family-name:--font-great-vibes) text-3xl text-[#8C7355] md:text-4xl">
                reception to follow
              </p>

              {/* Bottom Ornament */}
              <div className="mt-4 flex items-center justify-center gap-2 text-[#B79A50]">
                <span className="h-px w-6 bg-current opacity-50" />
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="opacity-80">
                  <path d="M12 2C12 2 14 8 18 12C14 16 12 22 12 22C12 22 10 16 6 12C10 8 12 2 12 2Z" fill="currentColor" />
                </svg>
                <span className="h-px w-6 bg-current opacity-50" />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Closing Message */}
      <div className="invitation-text relative z-10 mt-16 text-center">
        <Heart size={18} className="invitation-floating-heart mx-auto mb-4 fill-[#D4AF37] text-[#D4AF37]" strokeWidth={1} />
        <p className="font-(family-name:--font-cormorant) text-2xl italic text-[#555555] md:text-3xl">
          We can&apos;t wait to celebrate with you.
        </p>
        <p className="mt-4 font-(family-name:--font-montserrat) text-[9px] font-semibold uppercase tracking-[0.4em] text-[#A58A46]">
          {wedding
            ? `A lifetime begins on ${weddingDate?.toLocaleDateString("en", { month: "long", day: "numeric", year: "numeric" })}`
            : "Wedding details to be announced"}
        </p>
      </div>

    </section>
  );
}
