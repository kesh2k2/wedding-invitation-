import { z } from "zod";

const name = z.string().trim().min(1).max(100);

export const guestInputSchema = z.discriminatedUnion("guestType", [
  z.object({
    guestType: z.literal("individual"),
    primaryGuestName: name,
    email: z.email().optional().or(z.literal("")),
    phone: z.string().trim().max(40).optional().or(z.literal("")),
  }).strict(),
  z.object({
    guestType: z.literal("family"),
    primaryGuestName: name,
    familyName: z.string().trim().max(100).optional().or(z.literal("")),
    email: z.email().optional().or(z.literal("")),
    phone: z.string().trim().max(40).optional().or(z.literal("")),
  }).strict(),
  z.object({
    guestType: z.literal("couple"),
    primaryGuestName: name,
    secondaryGuestName: name,
    email: z.email().optional().or(z.literal("")),
    phone: z.string().trim().max(40).optional().or(z.literal("")),
  }).strict(),
]);

export const guestSearchSchema = z.object({
  search: z.string().trim().max(100).optional(),
  guestType: z.enum(["individual", "family", "couple"]).optional(),
  invitationStatus: z.enum(["active", "revoked"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export type GuestInput = z.infer<typeof guestInputSchema>;
