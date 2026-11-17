"use client";

import Image from "next/image";
import { useRef } from "react";
import { Heart, GraduationCap, BookOpen, Coffee, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const storyEvents = [
  {
    number: "01",
    year: "2021",
    title: "Where It All Began",
    subtitle: "A University Encounter",
    description:
      "It all started at university. Two strangers, walking different paths, never imagined that a simple encounter would become the beginning of something beautiful. Among lectures, assignments, and campus life, destiny had its own plans.",
    // Sample University Image
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop",
    imageAlt: "University campus where their story began",
    icon: GraduationCap,
    side: "left",
  },
  {
    number: "02",
    year: "2022",
    title: "From Strangers to Friends",
    subtitle: "Little Moments, Beautiful Memories",
    description:
      "Shared lectures, long conversations, group assignments, and countless cups of coffee slowly brought them closer. What started as simple friendship became the most special part of their university days.",
    // Sample Coffee/Friendship Image
    image: "https://images.unsplash.com/photo-1521000050181-9a835e39c4d9?q=80&w=1000&auto=format&fit=crop",
    imageAlt: "A beautiful university memory",
    icon: BookOpen,
    side: "right",
  },
  {
    number: "03",
    year: "2023",
    title: "A Love Story Begins",
    subtitle: "More Than Just Friends",
    description:
      "Somewhere between laughter, late-night conversations, and unforgettable memories, their friendship turned into love. They discovered that the person they wanted to share every little moment with was standing right beside them.",
    // Sample Romantic Couple Image
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1000&auto=format&fit=crop",
    imageAlt: "A romantic moment together",
    icon: Heart,
    side: "left",
  },
  {
    number: "04",
    year: "2025",
    title: "A Promise Forever",
    subtitle: "The Beginning of a New Chapter",
    description:
      "Through every challenge, achievement, and beautiful moment, their bond grew stronger. They realised that their journey was no longer about two separate paths, but one future they wanted to build together.",
    // Sample Couple Together Image
    image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1000&auto=format&fit=crop",
    imageAlt: "The couple celebrating their journey",
    icon: Sparkles,
    side: "right",
  },
];

export default function OurStory() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // 1. Heading 3D Reveal
      gsap.fromTo(
        ".story-heading",
        { y: 50, opacity: 0, rotateX: -30, transformPerspective: 800 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".story-heading",
            start: "top 85%",
          },
        }
      );

      // 2. Scroll Scrubbed Timeline Line
      gsap.fromTo(
        ".story-line",
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "top",
          duration: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".story-timeline",
            start: "top 60%",
            end: "bottom 80%",
            scrub: 1,
          },
        }
      );

      // 3. Animate Timeline Cards (Images, Text, Parallax)
      gsap.utils.toArray<HTMLElement>(".story-card").forEach((card) => {
        const imageWrapper = card.querySelector(".image-wrapper");
        const image = card.querySelector(".parallax-image");
        const content = card.querySelector(".story-content");
        const yearText = card.querySelector(".year-text");

        // Image Clip Path Reveal
        if (imageWrapper) {
          gsap.fromTo(
            imageWrapper,
            { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" },
            {
              clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)",
              duration: 1.4,
              ease: "power4.inOut",
              scrollTrigger: {
                trigger: card,
                start: "top 80%",
              },
            }
          );
        }

        // Image Parallax Scroll
        if (image) {
          gsap.to(image, {
            yPercent: 15,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        }

        // Content Slide Up
        if (content) {
          gsap.fromTo(
            content,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              delay: 0.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 80%",
              },
            }
          );
        }

        // Year Text Parallax Effect
        if (yearText) {
          gsap.fromTo(
            yearText,
            { y: 50, opacity: 0 },
            {
              y: -20,
              opacity: 1,
              duration: 1.5,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 80%",
                scrub: 1,
              },
            }
          );
        }
      });

      // 4. Timeline Dots Pop-in
      gsap.utils.toArray<HTMLElement>(".story-dot").forEach((dot) => {
        gsap.fromTo(
          dot,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: dot,
              start: "top 85%",
            },
          }
        );
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

      {/* Background Glows */}
      <div className="pointer-events-none absolute -left-40 top-40 h-96 w-96 rounded-full bg-[#D4AF37]/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-40 h-96 w-96 rounded-full bg-[#D4AF37]/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-6xl">

        {/* ================= HEADING ================= */}
        <div className="story-heading mb-28 flex flex-col items-center text-center">
          <div className="mb-6 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#8C7355]" />
            <GraduationCap size={18} className="text-[#8C7355]" strokeWidth={1.4} />
            <span className="font-(family-name:--font-montserrat) text-[10px] font-semibold uppercase tracking-[0.4em] text-[#8C7355]">
              A Journey Written in the Stars
            </span>
            <GraduationCap size={18} className="text-[#8C7355]" strokeWidth={1.4} />
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#8C7355]" />
          </div>

          <h2 className="font-(family-name:--font-cormorant) text-5xl font-medium leading-tight text-[#222222] md:text-7xl">
            From Campus <br />
            <span className="italic text-[#B79A50]">to Forever</span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl font-(family-name:--font-montserrat) text-xs leading-7 text-[#777777] md:text-sm">
            What began with a simple hello in university became a beautiful journey of friendship, love, and forever. Here are a few chapters of our story.
          </p>
        </div>

        {/* ================= TIMELINE ================= */}
        <div className="story-timeline relative">

          {/* Animated Center Timeline Line */}
          <div className="story-line absolute bottom-0 left-[19px] top-0 w-[2px] bg-gradient-to-b from-[#D4AF37]/10 via-[#D4AF37]/60 to-[#D4AF37]/10 md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-24 md:space-y-32">
            {storyEvents.map((event, index) => {
              const Icon = event.icon;
              const isLeft = event.side === "left";

              return (
                <div
                  key={event.number}
                  className="story-card relative grid grid-cols-1 items-center gap-10 pl-14 md:grid-cols-2 md:gap-20 md:pl-0"
                >
                  {/* Timeline Dot */}
                  <div className="story-dot absolute left-[11px] top-8 z-10 flex h-[18px] w-[18px] items-center justify-center rounded-full border border-[#D4AF37] bg-[#FDFBF7] shadow-[0_0_15px_rgba(212,175,55,0.4)] md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
                    <span className="h-2 w-2 rounded-full bg-[#D4AF37]" />
                  </div>

                  {/* Image Section */}
                  <div
                    className={`group relative ${
                      isLeft ? "md:col-start-1 md:row-start-1" : "md:col-start-2 md:row-start-1"
                    }`}
                  >
                    {/* Clip-path Reveal Wrapper */}
                    <div className="image-wrapper relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-[#EDE8DF]">

                      {/* Parallax Image */}
                      <div className="parallax-image absolute inset-0 h-[115%] w-full -top-[7.5%]">
                        <Image
                          src={event.image}
                          alt={event.imageAlt}
                          fill
                          sizes="(max-width: 768px) 100vw, 550px"
                          className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />

                      {/* Premium Inner Border Frame */}
                      <div className="absolute inset-3 border border-white/20 pointer-events-none" />

                      <div className="absolute bottom-6 left-6 flex items-center gap-2 text-white">
                        <Icon size={16} strokeWidth={1.5} className="text-[#E8D9A9]" />
                        <span className="font-(family-name:--font-montserrat) text-[9px] font-semibold uppercase tracking-[0.3em]">
                          Chapter {event.number}
                        </span>
                      </div>
                    </div>

                    {/* Overlapping Gold Outline Frame */}
                    <div className="pointer-events-none absolute -bottom-4 -right-4 -z-10 h-full w-full border border-[#D4AF37]/40 md:-bottom-5 md:-right-5" />
                  </div>

                  {/* Content Section */}
                  <div
                    className={`story-content relative flex flex-col ${
                      isLeft
                        ? "md:col-start-2 md:row-start-1 md:pl-8"
                        : "md:col-start-1 md:row-start-1 md:pr-8 md:text-right"
                    }`}
                  >
                    {/* Massive Background Year Text */}
                    <div
                      className={`year-text pointer-events-none absolute top-1/2 -z-10 -translate-y-1/2 font-(family-name:--font-cormorant) text-[120px] font-bold leading-none text-[#D4AF37]/10 md:text-[180px] ${
                        isLeft ? "-left-6 md:-left-4" : "-right-6 md:-right-4"
                      }`}
                    >
                      {event.year}
                    </div>

                    <div className={`flex items-center gap-3 ${!isLeft ? "md:justify-end" : ""}`}>
                      <span className="font-(family-name:--font-great-vibes) text-4xl text-[#B79A50] md:text-5xl">
                        {event.year}
                      </span>
                      <span className="h-px w-10 bg-[#D4AF37]/50" />
                    </div>

                    <p className="mt-3 font-(family-name:--font-montserrat) text-[9px] font-semibold uppercase tracking-[0.3em] text-[#A58A46]">
                      {event.subtitle}
                    </p>

                    <h3 className="mt-4 font-(family-name:--font-cormorant) text-4xl font-medium leading-tight text-[#222222] md:text-5xl">
                      {event.title}
                    </h3>

                    <p className="mt-5 max-w-md font-(family-name:--font-montserrat) text-xs leading-7 text-[#666666] md:text-sm">
                      {event.description}
                    </p>

                    <div className={`mt-8 flex items-center gap-3 ${!isLeft ? "md:justify-end" : ""}`}>
                      <Heart size={14} className="text-[#C5A44D]" strokeWidth={1.4} />
                      <span className="font-(family-name:--font-great-vibes) text-2xl text-[#B79A50]">
                        A memory to treasure
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* ================= FINAL MESSAGE ================= */}
        <div className="relative mt-32 border-t border-[#D4AF37]/20 pt-20 text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#FDFBF7] shadow-[0_0_20px_rgba(212,175,55,0.15)]">
              <Coffee size={24} className="text-[#B79A50]" strokeWidth={1.3} />
            </div>
          </div>

          <p className="font-(family-name:--font-montserrat) text-[10px] font-semibold uppercase tracking-[0.4em] text-[#A58A46]">
            And the journey continues...
          </p>

          <h3 className="mt-6 font-(family-name:--font-cormorant) text-4xl italic text-[#222222] md:text-6xl">
            The best is yet to come.
          </h3>

          <p className="mx-auto mt-6 max-w-lg font-(family-name:--font-montserrat) text-xs leading-7 text-[#777777] md:text-sm">
            From university corridors to a lifetime together, we cannot wait to create many more beautiful memories.
          </p>

          <div className="mt-8 font-(family-name:--font-great-vibes) text-4xl text-[#B79A50] md:text-5xl">
            With Love, Always
          </div>
        </div>

      </div>
    </section>
  );
}
