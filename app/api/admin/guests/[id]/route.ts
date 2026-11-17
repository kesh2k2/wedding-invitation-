import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { jsonError, readJson, requireAdmin, safeGuest, verifySameOrigin } from "@/lib/http";
import { guestInputSchema } from "@/lib/validations/guest";
import Guest from "@/models/Guest";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;
    const { id } = await params;
    if (!isValidObjectId(id)) return jsonError("Guest not found.", 404);
    await connectToDatabase();
    const guest = await Guest.findById(id).lean();
    if (!guest) return jsonError("Guest not found.", 404);
    return NextResponse.json({ success: true, data: { guest: safeGuest(guest) } });
  } catch (error) {
    console.error("Reading guest failed:", error);
    return jsonError("Unable to retrieve guest.", 500);
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  if (!verifySameOrigin(request)) return jsonError("Invalid request origin.", 403);
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;
    const { id } = await params;
    if (!isValidObjectId(id)) return jsonError("Guest not found.", 404);

    const body = await readJson(request);
    if (body.error) return body.error;
    if (typeof body.data !== "object" || body.data === null || Array.isArray(body.data)) {
      return jsonError("Guest information must be an object.", 400);
    }

    await connectToDatabase();
    const guest = await Guest.findById(id);
    if (!guest) return jsonError("Guest not found.", 404);

    const currentGuest = {
      guestType: guest.guestType,
      primaryGuestName: guest.primaryGuestName,
      secondaryGuestName: guest.secondaryGuestName,
      familyName: guest.familyName,
      email: guest.email,
      phone: guest.phone,
    };
    const updatedGuest = { ...currentGuest, ...body.data };
    if (updatedGuest.guestType !== "couple") delete updatedGuest.secondaryGuestName;
    if (updatedGuest.guestType !== "family") delete updatedGuest.familyName;
    const parsed = guestInputSchema.safeParse(updatedGuest);
    if (!parsed.success) return jsonError("Guest information is invalid.", 400);
    guest.set(parsed.data);
    if (parsed.data.guestType !== "couple") guest.secondaryGuestName = undefined;
    if (parsed.data.guestType !== "family") guest.familyName = undefined;
    await guest.save();
    return NextResponse.json({ success: true, data: { guest: safeGuest(guest.toObject()) } });
  } catch (error) {
    console.error("Updating guest failed:", error);
    return jsonError("Unable to update guest.", 500);
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  if (!verifySameOrigin(request)) return jsonError("Invalid request origin.", 403);
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;
    const { id } = await params;
    if (!isValidObjectId(id)) return jsonError("Guest not found.", 404);
    await connectToDatabase();
    const result = await Guest.findByIdAndDelete(id);
    if (!result) return jsonError("Guest not found.", 404);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Deleting guest failed:", error);
    return jsonError("Unable to delete guest.", 500);
  }
}

async function setInvitationStatus(request: Request, context: RouteContext, status: "active" | "revoked") {
  if (!verifySameOrigin(request)) return jsonError("Invalid request origin.", 403);
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;
    const { id } = await context.params;
    if (!isValidObjectId(id)) return jsonError("Guest not found.", 404);
    await connectToDatabase();
    const guest = await Guest.findByIdAndUpdate(
      id,
      { invitationStatus: status },
      { returnDocument: "after" },
    ).lean();
    if (!guest) return jsonError("Guest not found.", 404);
    return NextResponse.json({ success: true, data: { guest: safeGuest(guest) } });
  } catch (error) {
    console.error(`Setting invitation status to ${status} failed:`, error);
    return jsonError("Unable to update invitation status.", 500);
  }
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const url = new URL(request.url);
  if (url.pathname.endsWith("/revoke")) return setInvitationStatus(request, context, "revoked");
  if (url.pathname.endsWith("/reactivate")) return setInvitationStatus(request, context, "active");
  return jsonError(`Unsupported action for guest ${id}.`, 404);
}
