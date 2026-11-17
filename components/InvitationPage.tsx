"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Invitation from "@/components/Invitation";
import type { PublicInvitation } from "@/lib/types";

export default function InvitationPage({ token }: { token: string }) {
  const [invitation, setInvitation] = useState<PublicInvitation | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "invalid" | "error">("loading");

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/invitations/${encodeURIComponent(token)}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (response.status === 404) {
          setState("invalid");
          return;
        }
        if (!response.ok) throw new Error("The invitation could not be loaded.");
        const result: { success: boolean; data?: PublicInvitation } = await response.json();
        if (!result.success || !result.data) throw new Error("The invitation response was incomplete.");
        setInvitation(result.data);
        setState("ready");
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") return;
        console.error("Loading invitation page failed:", error);
        setState("error");
      });

    return () => controller.abort();
  }, [token]);

  if (state === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FDFBF7] px-6 text-center">
        <p className="font-(family-name:--font-cormorant) text-3xl text-[#8C7355]">Preparing your invitation…</p>
      </main>
    );
  }

  if (state === "invalid" || state === "error" || !invitation) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FDFBF7] px-6 py-16">
        <section className="max-w-xl border border-[#D4AF37]/30 bg-[#F6F2EB] px-8 py-16 text-center shadow-xl sm:px-16">
          <p className="font-(family-name:--font-montserrat) text-[10px] font-semibold uppercase tracking-[0.4em] text-[#A58A46]">
            With love
          </p>
          <h1 className="mt-5 font-(family-name:--font-cormorant) text-5xl text-[#222222]">
            {state === "error" ? "Invitation unavailable" : "This invitation isn’t available"}
          </h1>
          <p className="mt-5 font-(family-name:--font-montserrat) text-sm leading-7 text-[#777777]">
            {state === "error"
              ? "We couldn’t load the invitation right now. Please try again later."
              : "This link may be incorrect or no longer active. Please contact the couple for assistance."}
          </p>
          <Link href="/" className="mt-8 inline-block font-(family-name:--font-montserrat) text-xs uppercase tracking-[0.2em] text-[#8C7355] underline underline-offset-4">
            Visit the wedding website
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      <Invitation greeting={invitation.guest.greeting} wedding={invitation.wedding} personalized />
    </main>
  );
}
