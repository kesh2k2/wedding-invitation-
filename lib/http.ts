import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth";

export function jsonError(message: string, status: number) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function readJson(request: Request) {
  try {
    return { data: await request.json(), error: null } as const;
  } catch {
    return { data: null, error: jsonError("Request body must be valid JSON.", 400) } as const;
  }
}

export async function requireAdmin() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return { admin: null, error: jsonError("Authentication required.", 401) };
  return { admin, error: null };
}

export function verifySameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export function safeGuest(guest: Record<string, unknown>) {
  const { _id, guestType, primaryGuestName, secondaryGuestName, familyName, email, phone, invitationStatus, createdAt, updatedAt } = guest;
  return { id: String(_id), guestType, primaryGuestName, secondaryGuestName, familyName, email, phone, invitationStatus, createdAt, updatedAt };
}

export function safeWedding(wedding: Record<string, unknown> | null) {
  if (!wedding) return null;
  const { groomName, brideName, weddingDate, weddingTime, venueName, venueAddress, googleMapsUrl, dressCode, weddingDescription } = wedding;
  return { groomName, brideName, weddingDate, weddingTime, venueName, venueAddress, googleMapsUrl, dressCode, weddingDescription };
}
