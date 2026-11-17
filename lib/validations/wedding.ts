import { z } from "zod";

export const weddingInputSchema = z.object({
  groomName: z.string().trim().min(1).max(100),
  brideName: z.string().trim().min(1).max(100),
  weddingDate: z.iso.date(),
  weddingTime: z.string().trim().min(1).max(40),
  venueName: z.string().trim().min(1).max(150),
  venueAddress: z.string().trim().min(1).max(300),
  googleMapsUrl: z.string().trim().max(2048).refine((value) => {
    if (!value) return true;
    try {
      const url = new URL(value);
      return url.protocol === "https:" &&
        ["google.com", "www.google.com", "maps.google.com", "maps.google.lk", "www.google.lk", "maps.app.goo.gl"].includes(url.hostname);
    } catch {
      return false;
    }
  }, "Enter a secure Google Maps URL."),
  dressCode: z.string().trim().max(150),
  weddingDescription: z.string().trim().max(2000),
}).strict();

export type WeddingInput = z.infer<typeof weddingInputSchema>;
