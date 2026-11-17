
"use client";

import { useRef } from "react";
import Link from "next/link";
import { useWedding } from "@/components/WeddingProvider";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const wedding = useWedding();

  useGSAP(
    () => {
      gsap.from(".footer-content", {
        y: 35,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
        },
      });
    },
    { scope: footerRef }
  );

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden bg-[#FAF9F6] text-[#222222]"
    >
      {/* Top Decorative Border */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-12 text-center md:grid-cols-3 md:items-center">

          {/* Couple Names */}
          <div className="footer-content">
            <p className="mb-3 font-body text-[10px] uppercase tracking-[0.35em] text-[#A88A38]">
              Together Forever
            </p>

            <h2 className="font-heading text-4xl font-medium text-[#222222] md:text-5xl">
              {wedding?.groomName || "The Groom"}{" "}
              <span className="font-script text-[#D4AF37]">&</span>{" "}
              {wedding?.brideName || "The Bride"}
            </h2>

            <p className="mt-3 font-body text-[10px] uppercase tracking-[0.25em] text-gray-500">
              {wedding?.weddingDate
                ? new Date(`${wedding.weddingDate}T00:00:00`).toLocaleDateString("en", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "Wedding date to be announced"}
            </p>
          </div>

          {/* Navigation */}
          <div className="footer-content">
            <p className="mb-5 font-body text-[10px] font-semibold uppercase tracking-[0.3em] text-[#A88A38]">
              Explore
            </p>

            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-4">
              {[
                { label: "Home", href: "#home" },
                { label: "Our Story", href: "#our-story" },
                { label: "Wedding", href: "#wedding" },
                { label: "Countdown", href: "#countdown" },
                { label: "Invitation", href: "#invitation" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="font-body text-xs text-gray-600 transition-colors duration-300 hover:text-[#B8963E]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social Links */}
          <div className="footer-content">
            <p className="mb-5 font-body text-[10px] font-semibold uppercase tracking-[0.3em] text-[#A88A38]">
              Stay Connected
            </p>

            <div className="flex justify-center gap-4">

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/40 text-[#A88A38] transition-all duration-300 hover:bg-[#D4AF37] hover:text-white"
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="18" cy="6" r="0.8" fill="currentColor" />
                </svg>
              </a>

              {/* Website */}
              <a
                href="#home"
                aria-label="Website"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/40 text-[#A88A38] transition-all duration-300 hover:bg-[#D4AF37] hover:text-white"
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3 12h18" />
                  <path d="M12 3a15 15 0 0 1 0 18" />
                  <path d="M12 3a15 15 0 0 0 0 18" />
                </svg>
              </a>

            </div>
          </div>
        </div>

        {/* Decorative Divider */}
        <div className="my-12 flex items-center justify-center gap-4">
          <div className="h-px flex-1 bg-[#D4AF37]/25" />

          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="#D4AF37"
            stroke="#D4AF37"
            strokeWidth="1"
          >
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
          </svg>

          <div className="h-px flex-1 bg-[#D4AF37]/25" />
        </div>

        {/* Bottom Footer */}
        <div className="footer-content flex flex-col items-center justify-between gap-5 text-center md:flex-row">

          <p className="font-body text-[10px] tracking-wide text-gray-500">
            © {wedding?.weddingDate.slice(0, 4) ?? ""} {wedding ? `${wedding.groomName} & ${wedding.brideName}` : "Wedding celebration"}. All Rights Reserved.
          </p>

          <p className="font-body text-[10px] tracking-wide text-gray-500">
            Made with{" "}
            <span className="mx-1 text-[#D4AF37]">♥</span>
            for a lifetime of love.
          </p>

          {/* Back To Top */}
          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="group flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.2em] text-[#A88A38] transition-colors hover:text-[#222222]"
          >
            Back to Top

            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D4AF37]/40 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-[#D4AF37] group-hover:text-white">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 19V5" />
                <path d="m5 12 7-7 7 7" />
              </svg>
            </span>
          </button>

        </div>
      </div>
    </footer>
  );
}
