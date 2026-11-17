"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";
import { Heart, ArrowRight, Sparkles } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const leaf1Ref = useRef<HTMLDivElement>(null);
  const leaf2Ref = useRef<HTMLDivElement>(null);

  // 1. Mouse Parallax Effect
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 30;
      const yPos = (clientY / window.innerHeight - 0.5) * 30;

      gsap.to(imageRef.current, {
        x: xPos * 0.6,
        y: yPos * 0.6,
        duration: 1.5,
        ease: "power2.out",
      });

      gsap.to(leaf1Ref.current, {
        x: xPos * -1.5,
        y: yPos * -1.5,
        duration: 2,
        ease: "power2.out",
      });

      gsap.to(leaf2Ref.current, {
        x: xPos * -1.2,
        y: yPos * -1.2,
        duration: 2,
        ease: "power2.out",
      });
    };

    hero.addEventListener("mousemove", handleMouseMove);
    return () => hero.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 2. GSAP Entrance Animations
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        ".reveal-mask",
        { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" },
        { clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)", duration: 1.5, stagger: 0.2 }
      )
        .fromTo(
          ".fade-in-element",
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.15 },
          "-=1"
        )
        .fromTo(
          ".watercolor-image",
          { opacity: 0, scale: 1.05, filter: "blur(8px)" },
          { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.5, ease: "power3.out" },
          "-=1"
        )
        .fromTo(
          ".botanical-leaf",
          { opacity: 0, scale: 0.8, rotate: -5 },
          { opacity: 1, scale: 1, rotate: 0, duration: 1.2, stagger: 0.2, ease: "back.out(1.2)" },
          "-=0.8"
        )
        // CTA Button Reveal
        .fromTo(
          ".cta-button",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.6"
        );

      // Floating Leaves Animation
      gsap.to(leaf1Ref.current, {
        y: -12,
        rotation: 2,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(leaf2Ref.current, {
        y: 12,
        rotation: -2,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1,
      });
    },
    { scope: heroRef }
  );

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-start overflow-hidden bg-[#FDFBF7] pt-28 pb-16 lg:justify-center lg:pt-24"
    >
      {/* ================= LUXURY PATTERN BACKGROUND ================= */}
      {/* Opacity increased to 0.08 for better visibility */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%238C7355' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M60 10 C70 30 90 40 60 60 C30 40 50 30 60 10 Z'/%3E%3Cpath d='M60 110 C50 90 30 80 60 60 C90 80 70 90 60 110 Z'/%3E%3Cpath d='M10 60 C30 50 40 30 60 60 C40 90 30 70 10 60 Z'/%3E%3Cpath d='M110 60 C90 70 80 90 60 60 C80 30 90 50 110 60 Z'/%3E%3Ccircle cx='60' cy='60' r='4' fill='%238C7355'/%3E%3Ccircle cx='0' cy='0' r='4' fill='%238C7355'/%3E%3Ccircle cx='120' cy='0' r='4' fill='%238C7355'/%3E%3Ccircle cx='0' cy='120' r='4' fill='%238C7355'/%3E%3Ccircle cx='120' cy='120' r='4' fill='%238C7355'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px"
        }}
      />

      {/* Subtle Paper Grain */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-30 mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")`
        }}
      />

      {/* Soft Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60 blur-[120px]" />

      {/* SVG Filters for Watercolor Effect */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id="watercolor-edge">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Main Content Container */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center px-4 sm:px-6">

        {/* Top Typography */}
        <div className="flex flex-col items-center text-center">
          <div className="reveal-mask overflow-hidden pb-2">
            <h2 className="font-(family-name:--font-great-vibes) text-6xl leading-[0.9] text-[#8C7355] sm:text-7xl md:text-[110px] drop-shadow-sm">
              Save
            </h2>
          </div>
          <div className="reveal-mask -mt-2 overflow-hidden pb-2 sm:-mt-4 md:-mt-6">
            <h2
              className="font-(family-name:--font-great-vibes) text-7xl leading-none sm:text-8xl md:text-[130px]"
              style={{
                background: "linear-gradient(to right, #A68A61, #C9B07A, #8C7355)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0px 2px 4px rgba(140, 115, 85, 0.15))"
              }}
            >
              the Date
            </h2>
          </div>
        </div>

        {/* Divider & Date */}
        <div className="fade-in-element mt-6 flex flex-col items-center">
          <div className="flex items-center gap-4">
            <span className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[#8C7355]/60 sm:w-24" />
            <Heart size={14} className="text-[#8C7355]" fill="currentColor" strokeWidth={0} />
            <span className="h-[1px] w-16 bg-gradient-to-l from-transparent to-[#8C7355]/60 sm:w-24" />
          </div>
          <p className="mt-6 font-(family-name:--font-montserrat) text-[10px] font-semibold uppercase tracking-[0.4em] text-[#8C7355] sm:text-xs">
            8<sup className="text-[8px] sm:text-[10px]">TH</sup> February, 2026
          </p>
        </div>

        {/* Watercolor Image Section */}
        <div className="relative mt-12 w-full max-w-2xl px-2 sm:px-0">

          {/* Image Wrapper */}
          <div
            ref={imageRef}
            className="watercolor-image relative aspect-[4/3] w-full"
          >
            {/* The outer watercolor edge */}
            <div
              className="absolute inset-0 overflow-hidden rounded-sm bg-white"
              style={{ filter: "url(#watercolor-edge)" }}
            >
              <Image
                src="/images/hero.jpg" // Replace with your actual image path
                alt="Couple at the beach"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover"
              />
              {/* Inner gradient to blend */}
              <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#FDFBF7]/80 to-transparent mix-blend-screen" />
            </div>

            {/* White inner border for premium framing */}
            <div className="absolute inset-2 border border-white/40 rounded-sm pointer-events-none" />
          </div>

          {/* Botanical Leaf 1 (Top Left) */}
          <div
            ref={leaf1Ref}
            className="botanical-leaf absolute -left-8 -top-16 z-20 w-32 text-[#A6A18A] sm:-left-16 sm:-top-20 sm:w-48 md:w-56"
          >
            <svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 300 Q 90 200 20 100" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M70 220 Q 40 200 20 220 Q 40 240 70 220 Z" fill="currentColor" opacity="0.6"/>
              <path d="M50 180 Q 20 150 10 180 Q 30 200 50 180 Z" fill="currentColor" opacity="0.8"/>
              <path d="M35 140 Q 10 100 0 130 Q 20 160 35 140 Z" fill="currentColor" opacity="0.5"/>
              <path d="M25 100 Q 10 60 0 80 Q 15 110 25 100 Z" fill="currentColor" opacity="0.7"/>
              <path d="M65 200 Q 80 170 100 190 Q 80 220 65 200 Z" fill="currentColor" opacity="0.6"/>
              <path d="M50 160 Q 70 120 90 140 Q 70 180 50 160 Z" fill="currentColor" opacity="0.8"/>
              <path d="M40 120 Q 60 80 80 100 Q 60 140 40 120 Z" fill="currentColor" opacity="0.5"/>
              <circle cx="15" cy="105" r="3" fill="currentColor"/>
              <circle cx="5" cy="135" r="2" fill="currentColor"/>
              <circle cx="25" cy="225" r="4" fill="currentColor"/>
            </svg>
          </div>

          {/* Botanical Leaf 2 (Bottom Right) */}
          <div
            ref={leaf2Ref}
            className="botanical-leaf absolute -bottom-20 -right-6 z-20 w-36 rotate-180 text-[#B3AE9C] sm:-right-16 sm:-bottom-24 sm:w-56 md:w-64"
          >
             <svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 300 Q 90 200 20 100" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M70 220 Q 40 200 20 220 Q 40 240 70 220 Z" fill="currentColor" opacity="0.6"/>
              <path d="M50 180 Q 20 150 10 180 Q 30 200 50 180 Z" fill="currentColor" opacity="0.8"/>
              <path d="M35 140 Q 10 100 0 130 Q 20 160 35 140 Z" fill="currentColor" opacity="0.5"/>
              <path d="M25 100 Q 10 60 0 80 Q 15 110 25 100 Z" fill="currentColor" opacity="0.7"/>
              <path d="M65 200 Q 80 170 100 190 Q 80 220 65 200 Z" fill="currentColor" opacity="0.6"/>
              <path d="M50 160 Q 70 120 90 140 Q 70 180 50 160 Z" fill="currentColor" opacity="0.8"/>
              <path d="M40 120 Q 60 80 80 100 Q 60 140 40 120 Z" fill="currentColor" opacity="0.5"/>
              <circle cx="15" cy="105" r="3" fill="currentColor"/>
              <circle cx="5" cy="135" r="2" fill="currentColor"/>
              <circle cx="25" cy="225" r="4" fill="currentColor"/>
            </svg>
          </div>

        </div>

        {/* ================= GOLDEN-WHITE MIX CTA BUTTON ================= */}
        <div className="cta-button mt-14 pb-8">
          <a
            href="#invitation"
            className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full border border-[#D4AF37]/50 bg-gradient-to-r from-white via-[#FDFBF7] to-[#F4E8C1] px-10 py-4 font-(family-name:--font-montserrat) text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8C7355] shadow-[0_8px_30px_rgba(212,175,55,0.15)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(212,175,55,0.3)]"
          >
            <Sparkles size={14} className="relative z-10 transition-transform duration-500 group-hover:rotate-12 group-hover:text-[#A68A61]" />
            <span className="relative z-10 transition-colors duration-300 group-hover:text-[#A68A61]">
              View Invitation
            </span>
            <ArrowRight size={14} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#A68A61]" />

            {/* Animated Shine Sweep Effect */}
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white to-transparent opacity-60 transition-transform duration-700 ease-out group-hover:translate-x-full" />
          </a>
        </div>

      </div>
    </section>
  );
}
