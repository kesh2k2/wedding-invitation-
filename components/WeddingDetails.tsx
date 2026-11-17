"use client";

import { useRef } from "react";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Shirt,
  ArrowUpRight,
  Sparkles,
  Heart,
  Navigation,
} from "lucide-react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useWedding } from "@/components/WeddingProvider";

gsap.registerPlugin(ScrollTrigger);

export default function WeddingDetails() {
  const sectionRef = useRef<HTMLElement>(null);
  const wedding = useWedding();
  const date = wedding ? new Date(`${wedding.weddingDate}T00:00:00`) : null;
  const weddingInfo = [
    {
      number: "01",
      label: "THE DATE",
      title: date?.toLocaleDateString("en", { day: "numeric", month: "long", year: "numeric" }) ?? "To be announced",
      subtitle: date?.toLocaleDateString("en", { weekday: "long" }) ?? "",
      icon: CalendarDays,
    },
    {
      number: "02",
      label: "THE TIME",
      title: wedding?.weddingTime || "To be announced",
      subtitle: wedding ? "Ceremony begins" : "",
      icon: Clock3,
    },
    {
      number: "03",
      label: "THE VENUE",
      title: wedding?.venueName || "To be announced",
      subtitle: wedding?.venueAddress || "",
      icon: MapPin,
    },
    {
      number: "04",
      label: "DRESS CODE",
      title: wedding?.dressCode || "To be announced",
      subtitle: wedding?.dressCode ? "Celebrate in style" : "",
      icon: Shirt,
    },
  ];
  const venueQuery = encodeURIComponent(`${wedding?.venueName ?? ""} ${wedding?.venueAddress ?? ""}`.trim());
  const directionsUrl = wedding?.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${venueQuery}`;
  const embeddedMapUrl = `https://www.google.com/maps?q=${venueQuery}&output=embed`;

  useGSAP(
    () => {
      // 1. Header Reveal
      gsap.fromTo(
        ".wedding-heading",
        { y: 50, opacity: 0, rotateX: -30, transformPerspective: 800 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".wedding-heading",
            start: "top 85%",
          },
        }
      );

      // 2. Info Cards Stagger Reveal
      gsap.fromTo(
        ".wedding-info-card",
        { y: 45, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          stagger: 0.15,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: ".wedding-info-grid",
            start: "top 85%",
          },
        }
      );

      // 3. Map Reveal (Clip Path)
      gsap.fromTo(
        ".wedding-map-wrapper",
        { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)", opacity: 0 },
        {
          clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)",
          opacity: 1,
          duration: 1.4,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: ".wedding-venue-section",
            start: "top 80%",
          },
        }
      );

      // 4. Venue Text Slide In
      gsap.fromTo(
        ".wedding-venue-content",
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          delay: 0.3,
          scrollTrigger: {
            trigger: ".wedding-venue-section",
            start: "top 80%",
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="wedding"
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
      <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-[#D4AF37]/10 blur-[120px]" />
      <div className="pointer-events-none absolute -left-32 bottom-20 h-96 w-96 rounded-full bg-[#D4AF37]/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* ================= SECTION HEADING ================= */}
        <div className="wedding-heading mb-20 flex flex-col items-center text-center">
          <div className="mb-6 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#8C7355]" />
            <Sparkles size={16} className="text-[#8C7355]" strokeWidth={1.5} />
            <span className="font-(family-name:--font-montserrat) text-[10px] font-semibold uppercase tracking-[0.4em] text-[#8C7355]">
              Join Us for Our Special Day
            </span>
            <Sparkles size={16} className="text-[#8C7355]" strokeWidth={1.5} />
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#8C7355]" />
          </div>

          <h2 className="font-(family-name:--font-cormorant) text-5xl font-medium text-[#222222] md:text-7xl">
            The Wedding <span className="italic text-[#B79A50]">Details</span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl font-(family-name:--font-montserrat) text-xs leading-7 text-[#777777] md:text-sm">
            We would be delighted to have you with us as we celebrate the beginning of our forever. Here are the details you need to know.
          </p>
        </div>

        {/* ================= INFORMATION CARDS ================= */}
        <div className="wedding-info-grid grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {weddingInfo.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.number}
                className="wedding-info-card group relative overflow-hidden rounded-2xl border border-[#D4AF37]/30 bg-white/60 px-7 py-10 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-[#D4AF37] hover:shadow-[0_20px_50px_-12px_rgba(100,80,30,0.15)]"
              >
                {/* Decorative Inner Frame */}
                <div className="absolute inset-2 rounded-xl border border-[#D4AF37]/10 pointer-events-none" />

                {/* Card Number */}
                <span className="absolute right-6 top-6 font-(family-name:--font-cormorant) text-4xl font-light text-[#D4AF37]/30">
                  {item.number}
                </span>

                {/* Icon */}
                <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#FDFBF7] shadow-sm transition-all duration-500 group-hover:bg-[#D4AF37] group-hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                  <Icon
                    size={22}
                    strokeWidth={1.4}
                    className="text-[#B79A50] transition-colors duration-500 group-hover:text-white"
                  />
                </div>

                {/* Card Content */}
                <p className="font-(family-name:--font-montserrat) text-[9px] font-bold uppercase tracking-[0.3em] text-[#A58A46]">
                  {item.label}
                </p>

                <h3 className="mt-3 font-(family-name:--font-cormorant) text-2xl font-semibold text-[#222222]">
                  {item.title}
                </h3>

                <p className="mt-2 font-(family-name:--font-montserrat) text-xs tracking-wide text-[#888888]">
                  {item.subtitle}
                </p>

                {/* Bottom Accent Line */}
                <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-[#D4AF37] to-[#E8D9A9] transition-all duration-500 group-hover:w-full" />
              </div>
            );
          })}
        </div>

        {/* ================= VENUE & MAP SECTION ================= */}
        <div className="wedding-venue-section mt-28 grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* Google Maps Iframe Wrapper */}
          <div className="relative">
            {/* Clip-path reveal wrapper */}
            <div className="wedding-map-wrapper relative aspect-[4/3] w-full overflow-hidden rounded-2xl border-4 border-white bg-[#EDE8DF] shadow-2xl">

              <iframe
                src={embeddedMapUrl}
                className="absolute inset-0 h-full w-full border-0"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Wedding Venue Map"
              ></iframe>

              {/* Floating Glass Badge over Map */}
              <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full border border-white/50 bg-white/80 px-4 py-2 shadow-lg backdrop-blur-md">
                <MapPin size={14} className="text-[#B79A50]" />
                <span className="font-(family-name:--font-montserrat) text-[9px] font-bold uppercase tracking-widest text-[#222]">
                  {wedding?.venueName || "Venue to be announced"}
                </span>
              </div>
            </div>

            {/* Gold Overlapping Frame */}
            <div className="pointer-events-none absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl border border-[#D4AF37]/50" />
          </div>

          {/* Venue Information Text */}
          <div className="wedding-venue-content">
            <p className="mb-5 flex items-center gap-2 font-(family-name:--font-montserrat) text-[10px] font-bold uppercase tracking-[0.35em] text-[#A58A46]">
              <Navigation size={12} />
              Where We Say I Do
            </p>

            <h3 className="font-(family-name:--font-cormorant) text-5xl font-medium leading-tight text-[#222222] md:text-6xl">
              A Place to <br />
              <span className="font-(family-name:--font-great-vibes) text-6xl italic text-[#B79A50] md:text-7xl">
                Remember
              </span>
            </h3>

            <div className="my-8 h-px w-24 bg-gradient-to-r from-[#D4AF37] to-transparent" />

            <div className="flex items-start gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-white/50 backdrop-blur-sm">
                <MapPin size={24} strokeWidth={1.4} className="text-[#B79A50]" />
              </div>

              <div>
                <h4 className="font-(family-name:--font-cormorant) text-2xl font-semibold text-[#222222]">
                  {wedding?.venueName || "Venue to be announced"}
                </h4>
                <p className="mt-2 font-(family-name:--font-montserrat) text-xs leading-7 text-[#777777] md:text-sm">
                  {wedding?.venueAddress || "Venue address to be announced."}
                </p>
              </div>
            </div>

            {/* Directions Button */}
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative mt-10 inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-[#B89546] via-[#C9A85F] to-[#B89546] px-8 py-4 font-(family-name:--font-montserrat) text-[10px] font-semibold uppercase tracking-[0.2em] text-white shadow-[0_10px_30px_-10px_rgba(184,149,70,0.8)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_15px_40px_-10px_rgba(184,149,70,1)]"
            >
              <span className="relative z-10">Get Directions</span>
              <ArrowUpRight
                size={16}
                className="relative z-10 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
              {/* Shine Sweep */}
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
            </a>
          </div>
        </div>

        {/* ================= BOTTOM NOTE ================= */}
        <div className="mt-28 border-t border-[#D4AF37]/20 pt-16 text-center">
          <Heart size={20} strokeWidth={1.2} className="mx-auto mb-6 fill-[#D4AF37] text-[#D4AF37]" />
          <p className="font-(family-name:--font-cormorant) text-3xl italic text-[#555555] md:text-4xl">
            Your presence is our greatest gift.
          </p>
          <p className="mt-5 font-(family-name:--font-montserrat) text-[9px] font-bold uppercase tracking-[0.4em] text-[#A58A46]">
            We look forward to celebrating with you
          </p>
        </div>

      </div>
    </section>
  );
}
