"use client";

import { useEffect, useRef, useState } from "react";
import { Heart, Sparkles, Diamond, CalendarDays, Clock } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useWedding } from "@/components/WeddingProvider";

gsap.registerPlugin(ScrollTrigger);

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(date: string): TimeLeft {
  const difference = new Date(`${date}T00:00:00`).getTime() - Date.now();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export default function Countdown() {
  const sectionRef = useRef<HTMLElement>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const wedding = useWedding();
  const weddingDate = wedding?.weddingDate;

  // Live Countdown
  useEffect(() => {
    if (!weddingDate) return;
    const updateCountdown = () => {
      setTimeLeft(calculateTimeLeft(weddingDate));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [weddingDate]);

  // GSAP Animations
  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      // 1. Header Reveal (3D Rotate)
      tl.fromTo(
        ".countdown-header",
        { opacity: 0, y: 50, rotateX: -30, transformPerspective: 800 },
        { opacity: 1, y: 0, rotateX: 0, duration: 1.2, stagger: 0.15, ease: "power3.out" }
      )
      // 2. Central Date Card Reveal
      .fromTo(
        ".date-card",
        { opacity: 0, scale: 0.8, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 1, ease: "back.out(1.5)" },
        "-=0.6"
      )
      // 3. Countdown Boxes 3D Flip In
      .fromTo(
        ".countdown-box",
        { opacity: 0, y: 40, rotateY: 45 },
        {
          opacity: 1,
          y: 0,
          rotateY: 0,
          duration: 1,
          stagger: 0.15,
          ease: "back.out(1.2)"
        },
        "-=0.5"
      )
      // 4. Bottom Message Reveal
      .fromTo(
        ".bottom-msg",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        "-=0.6"
      );

      // Continuous Rotation for Decorative Rings
      gsap.to(".spin-slow", {
        rotation: 360,
        duration: 40,
        repeat: -1,
        ease: "none",
      });

      gsap.to(".spin-reverse", {
        rotation: -360,
        duration: 50,
        repeat: -1,
        ease: "none",
      });
    },
    { scope: sectionRef }
  );

  const countdownItems = [
    { label: "Days", value: timeLeft?.days ?? 0 },
    { label: "Hours", value: timeLeft?.hours ?? 0 },
    { label: "Minutes", value: timeLeft?.minutes ?? 0 },
    { label: "Seconds", value: timeLeft?.seconds ?? 0 },
  ];

  const isWeddingDay = timeLeft !== null && timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <section
      ref={sectionRef}
      id="countdown"
      className="relative overflow-hidden bg-[#FDFBF7] px-5 py-28 md:px-10 md:py-36"
    >
      {/* ================= LUXURY PATTERN BACKGROUND ================= */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%238C7355' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M60 10 C70 30 90 40 60 60 C30 40 50 30 60 10 Z'/%3E%3Cpath d='M60 110 C50 90 30 80 60 60 C90 80 70 90 60 110 Z'/%3E%3Cpath d='M10 60 C30 50 40 30 60 60 C40 90 30 70 10 60 Z'/%3E%3Cpath d='M110 60 C90 70 80 90 60 60 C80 30 90 50 110 60 Z'/%3E%3Ccircle cx='60' cy='60' r='4' fill='%238C7355'/%3E%3Ccircle cx='0' cy='0' r='4' fill='%238C7355'/%3E%3Ccircle cx='120' cy='0' r='4' fill='%238C7355'/%3E%3Ccircle cx='0' cy='120' r='4' fill='%238C7355'/%3E%3Ccircle cx='120' cy='120' r='4' fill='%238C7355'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px"
        }}
      />

      {/* Subtle Paper Grain */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40 mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")`
        }}
      />

      {/* Background Glows */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4AF37]/5 blur-[120px]" />

      {/* Decorative Animated Rings */}
      <div className="spin-slow pointer-events-none absolute -left-20 top-20 hidden h-96 w-96 rounded-full border border-[#D4AF37]/10 md:block">
        <div className="absolute inset-8 rounded-full border border-[#D4AF37]/15 border-dashed" />
      </div>
      <div className="spin-reverse pointer-events-none absolute -right-20 bottom-20 hidden h-96 w-96 rounded-full border border-[#D4AF37]/10 md:block">
        <div className="absolute inset-8 rounded-full border border-[#D4AF37]/15 border-dashed" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">

        {/* ================= HEADER ================= */}
        <div className="countdown-header flex flex-col items-center text-center">

          {/* Clock Icon Container */}
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-white/50 shadow-[0_0_20px_rgba(212,175,55,0.15)] backdrop-blur-sm">
            <Clock size={28} className="text-[#8C7355]" strokeWidth={1.2} />
          </div>

          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#8C7355]" />
            <Sparkles size={16} className="text-[#8C7355]" strokeWidth={1.5} />
            <span className="font-(family-name:--font-montserrat) text-[10px] font-semibold uppercase tracking-[0.4em] text-[#8C7355]">
              The Big Day Is Approaching
            </span>
            <Sparkles size={16} className="text-[#8C7355]" strokeWidth={1.5} />
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#8C7355]" />
          </div>

          {/* Changed Font Weight & Family for Title */}
          <h2 className="font-(family-name:--font-montserrat) text-3xl font-light uppercase tracking-[0.2em] text-[#222222] md:text-5xl">
            Counting Down to
          </h2>
          <h2 className="mt-2 font-(family-name:--font-great-vibes) text-6xl italic text-[#B79A50] md:text-8xl">
            Forever
          </h2>

          <p className="mx-auto mt-6 max-w-lg font-(family-name:--font-montserrat) text-xs font-light leading-7 text-[#777777] md:text-sm">
            A new chapter, a lifetime of love, and a beautiful beginning await us. Every second brings us closer to our special day.
          </p>
        </div>

        {/* ================= CENTRAL DATE CARD ================= */}
        <div className="date-card mt-16 flex justify-center">
          <div className="relative inline-flex flex-col items-center rounded-2xl border border-[#D4AF37]/30 bg-white/60 px-12 py-8 shadow-[0_15px_50px_-15px_rgba(212,175,55,0.3)] backdrop-blur-md">

            {/* Top decorative line */}
            <div className="absolute top-0 left-1/2 h-[2px] w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

            {/* Calendar Icon & Save Our Date Text */}
            <div className="flex items-center gap-2 text-[#8C7355]">
              <CalendarDays size={16} strokeWidth={1.5} />
              <span className="font-(family-name:--font-montserrat) text-[10px] font-semibold uppercase tracking-[0.4em]">
                Save Our Date
              </span>
            </div>

            <p className="mt-3 font-(family-name:--font-montserrat) text-4xl font-thin tracking-widest text-[#222222] md:text-6xl">
              20 <span className="text-2xl text-[#D4AF37] md:text-4xl">.</span> 12 <span className="text-2xl text-[#D4AF37] md:text-4xl">.</span> 2026
            </p>

            <div className="mt-4 flex items-center gap-2 text-[#8C7355]">
              <Diamond size={10} fill="currentColor" />
              <span className="font-(family-name:--font-montserrat) text-[9px] font-medium uppercase tracking-[0.3em]">
                Sunday · December 20, 2026
              </span>
              <Diamond size={10} fill="currentColor" />
            </div>
          </div>
        </div>

        {/* ================= COUNTDOWN TIMER BOXES ================= */}
        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {countdownItems.map((item) => (
            <div
              key={item.label}
              className="countdown-box group relative overflow-hidden rounded-xl border border-[#D4AF37]/30 bg-gradient-to-b from-white/90 to-[#FDFBF7]/50 px-4 py-10 text-center shadow-[0_10px_40px_-10px_rgba(100,80,30,0.08)] backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-[#D4AF37] hover:shadow-[0_20px_50px_-10px_rgba(100,80,30,0.15)] md:py-14"
            >
              {/* Inner Gold Frame */}
              <div className="absolute inset-2 rounded-lg border border-[#D4AF37]/10 pointer-events-none" />

              {/* Top Glow Line */}
              <div className="absolute left-1/2 top-0 h-[3px] w-0 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent transition-all duration-500 group-hover:w-full" />

              {/* Number - Changed to thin font-montserrat */}
              <p className="font-(family-name:--font-montserrat) text-6xl font-thin tabular-nums text-[#222222] md:text-8xl drop-shadow-sm">
                {String(item.value).padStart(2, "0")}
              </p>

              {/* Label - Changed to serif font */}
              <span className="mt-4 block font-(family-name:--font-cormorant) text-sm font-semibold uppercase tracking-[0.3em] text-[#8C7355] md:text-base">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* ================= BOTTOM MESSAGE ================= */}
        <div className="bottom-msg mt-20 text-center">
          {isWeddingDay ? (
            <div className="flex flex-col items-center">
              <Heart size={24} className="mb-4 text-[#D4AF37] animate-pulse" fill="#D4AF37" />
              <p className="font-(family-name:--font-great-vibes) text-5xl text-[#B79A50] md:text-7xl">
                Today is the day!
              </p>
              <p className="mt-4 font-(family-name:--font-montserrat) text-[10px] font-semibold tracking-[0.4em] text-[#777777]">
                LET THE CELEBRATION BEGIN
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="mb-5 flex items-center justify-center gap-4">
                <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
                <Heart size={16} className="fill-[#D4AF37] text-[#D4AF37]" strokeWidth={1} />
                <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#D4AF37]" />
              </div>

              <p className="font-(family-name:--font-great-vibes) text-4xl text-[#B79A50] md:text-5xl">
                We can&apos;t wait to celebrate with you
              </p>

              <p className="mt-4 font-(family-name:--font-montserrat) text-[10px] font-semibold uppercase tracking-[0.4em] text-[#999999]">
                {wedding
                  ? `${wedding.groomName} & ${wedding.brideName} · ${new Date(`${wedding.weddingDate}T00:00:00`).toLocaleDateString("en", { day: "numeric", month: "long", year: "numeric" })}`
                  : "Wedding date to be announced"}
              </p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
