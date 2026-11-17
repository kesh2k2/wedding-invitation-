"use client";

import Image from "next/image";
import { useRef } from "react";
import { Heart, Sparkles, Diamond } from "lucide-react";
import { useWedding } from "@/components/WeddingProvider";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function Couple() {
  const sectionRef = useRef<HTMLElement>(null);
  const wedding = useWedding();

  useGSAP(
    () => {
      // 1. Header Text 3D Reveal
      gsap.fromTo(
        ".header-reveal",
        { y: 50, opacity: 0, rotateX: -45, transformPerspective: 800 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".header-container",
            start: "top 85%",
          },
        }
      );

      // 2. Image Clip-Path Reveal Animation
      gsap.utils.toArray<HTMLElement>(".image-reveal-wrapper").forEach((wrapper) => {
        gsap.fromTo(
          wrapper,
          { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" },
          {
            clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)",
            duration: 1.4,
            ease: "power4.inOut",
            scrollTrigger: {
              trigger: wrapper,
              start: "top 80%",
            },
          }
        );
      });

      // 3. Parallax Scrolling on Images
      gsap.utils.toArray<HTMLElement>(".parallax-image").forEach((img) => {
        gsap.to(img, {
          yPercent: 15, // Moves down 15% while scrolling
          ease: "none",
          scrollTrigger: {
            trigger: img.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true, // Smoothly links animation to scrollbar
          },
        });
      });

      // 4. Text Slide Up
      gsap.utils.toArray<HTMLElement>(".text-reveal").forEach((text) => {
        gsap.fromTo(
          text,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: text,
              start: "top 90%",
            },
          }
        );
      });

      // 5. Center Line Draw & Heart Rotation on Scroll
      gsap.fromTo(
        ".center-line",
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "top center",
          duration: 1.5,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: ".center-connection",
            start: "top 80%",
            end: "bottom 50%",
            scrub: 1,
          },
        }
      );

      gsap.to(".center-heart", {
        rotation: 360,
        scrollTrigger: {
          trigger: ".center-connection",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="story"
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

      {/* Decorative Glows */}
      <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-[#D4AF37]/10 blur-[120px]" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-[#D4AF37]/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}
        <div className="header-container mb-24 flex flex-col items-center text-center">

          <div className="header-reveal mb-6 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#8C7355]" />
            <Sparkles size={16} className="text-[#8C7355]" strokeWidth={1.5} />
            <span className="font-(family-name:--font-montserrat) text-[10px] font-semibold uppercase tracking-[0.4em] text-[#8C7355]">
              The Beginning of Forever
            </span>
            <Sparkles size={16} className="text-[#8C7355]" strokeWidth={1.5} />
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#8C7355]" />
          </div>

          <h2 className="header-reveal font-(family-name:--font-cormorant) text-5xl font-medium text-[#222222] md:text-7xl">
            Two Souls, <span className="italic text-[#B79A50]">One Story</span>
          </h2>

          <p className="header-reveal mx-auto mt-6 max-w-xl font-(family-name:--font-montserrat) text-xs leading-7 text-[#777777] md:text-sm">
            Every love story is beautiful, but ours is our favourite.
            Two different paths brought us together, and now we begin
            a lifetime of love and happiness.
          </p>
        </div>

        {/* ================= COUPLE PROFILES (Editorial Layout) ================= */}
        <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">

          {/* Central Connecting Line (Visible on Desktop) */}
          <div className="center-connection absolute left-1/2 top-10 bottom-10 hidden w-px -translate-x-1/2 lg:block">
            <div className="center-line h-full w-full bg-gradient-to-b from-transparent via-[#D4AF37]/50 to-transparent" />

            {/* Floating Heart on the line */}
            <div className="center-heart absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#FDFBF7] shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              <Heart size={20} className="fill-[#D4AF37] text-[#D4AF37]" />
            </div>
          </div>

          {/* ---------------- GROOM ---------------- */}
          <div className="group relative lg:mt-12">
            <div className="image-reveal-wrapper relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-[#EDE8DF]">

              {/* Parallax Image inside clip-path */}
              <div className="parallax-image absolute inset-0 h-[115%] w-full -top-[7.5%]">
                <Image
                  src="/images/groom.jpg"
                  alt="Groom portrait"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />

              {/* Premium Border Frame */}
              <div className="absolute inset-4 border border-white/20 pointer-events-none" />

              <div className="absolute bottom-8 left-8">
                <span className="font-(family-name:--font-montserrat) text-[9px] font-semibold uppercase tracking-[0.3em] text-white/90">
                  The Groom
                </span>
              </div>

              {/* Floating Number */}
              <div className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center border border-white/40 bg-white/20 font-(family-name:--font-cormorant) text-xl text-white backdrop-blur-md">
                01
              </div>
            </div>

            <div className="text-reveal mt-8 px-2 text-center lg:text-left">
              <h3 className="font-(family-name:--font-great-vibes) text-5xl text-[#222222] md:text-6xl">
                {wedding?.groomName || "The Groom"}
              </h3>
              <p className="mt-3 font-(family-name:--font-montserrat) text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B79A50]">
                The One Who Found Her
              </p>
              <p className="mx-auto mt-5 max-w-md font-(family-name:--font-montserrat) text-xs leading-7 text-[#666666] lg:mx-0">
                A dreamer with a kind heart, finding his greatest
                happiness in the simplest moments of life. He promised her a lifetime of adventure.
              </p>
            </div>
          </div>

          {/* ---------------- BRIDE ---------------- */}
          <div className="group relative lg:mt-32">
            <div className="image-reveal-wrapper relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-[#EDE8DF]">

              {/* Parallax Image inside clip-path */}
              <div className="parallax-image absolute inset-0 h-[115%] w-full -top-[7.5%]">
                <Image
                  src="/images/bride.jpg"
                  alt="Bride portrait"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />

              {/* Premium Border Frame */}
              <div className="absolute inset-4 border border-white/20 pointer-events-none" />

              <div className="absolute bottom-8 left-8">
                <span className="font-(family-name:--font-montserrat) text-[9px] font-semibold uppercase tracking-[0.3em] text-white/90">
                  The Bride
                </span>
              </div>

              {/* Floating Number */}
              <div className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center border border-white/40 bg-white/20 font-(family-name:--font-cormorant) text-xl text-white backdrop-blur-md">
                02
              </div>
            </div>

            <div className="text-reveal mt-8 px-2 text-center lg:text-left">
              <h3 className="font-(family-name:--font-great-vibes) text-5xl text-[#222222] md:text-6xl">
                {wedding?.brideName || "The Bride"}
              </h3>
              <p className="mt-3 font-(family-name:--font-montserrat) text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B79A50]">
                The One Who Stole His Heart
              </p>
              <p className="mx-auto mt-5 max-w-md font-(family-name:--font-montserrat) text-xs leading-7 text-[#666666] lg:mx-0">
                A beautiful soul who brings warmth, laughter and
                endless happiness into every moment. She is his safe place to land.
              </p>
            </div>
          </div>

        </div>

        {/* ================= BOTTOM QUOTE ================= */}
        <div className="text-reveal mt-32 border-t border-[#D4AF37]/20 pt-16 text-center">
          <Diamond size={16} className="mx-auto mb-6 text-[#B79A50]" />
          <p className="font-(family-name:--font-cormorant) text-3xl italic leading-relaxed text-[#444444] md:text-5xl">
            &ldquo;And so, our forever begins...&rdquo;
          </p>
          <p className="mt-6 font-(family-name:--font-montserrat) text-[9px] font-semibold uppercase tracking-[0.5em] text-[#B79A50]">
            {wedding ? `${wedding.groomName} & ${wedding.brideName}` : "Celebrating their forever"}
          </p>
        </div>

      </div>
    </section>
  );
}
