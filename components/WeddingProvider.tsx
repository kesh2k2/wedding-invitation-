"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { WeddingInfo } from "@/lib/types";

const WeddingContext = createContext<WeddingInfo | null>(null);

export function useWedding() {
  return useContext(WeddingContext);
}

export default function WeddingProvider({ children }: { children: ReactNode }) {
  const [wedding, setWedding] = useState<WeddingInfo | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/wedding", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load wedding information.");
        const result: { success: boolean; data: { wedding: WeddingInfo | null } } = await response.json();
        if (!result.success) throw new Error("Could not load wedding information.");
        setWedding(result.data.wedding);
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") return;
        console.error("Loading wedding information failed:", error);
      });

    return () => controller.abort();
  }, []);

  return <WeddingContext.Provider value={wedding}>{children}</WeddingContext.Provider>;
}
