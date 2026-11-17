import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { createInvitationToken, hashInvitationToken } from "@/lib/token";
import { jsonError, readJson, requireAdmin, safeGuest, verifySameOrigin } from "@/lib/http";
import { guestInputSchema, guestSearchSchema } from "@/lib/validations/guest";
import Guest from "@/models/Guest";

export async function GET(request: Request) {
  void request.url;
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const query = guestSearchSchema.safeParse(
      Object.fromEntries(new URL(request.url).searchParams.entries()),
    );
    if (!query.success) return jsonError("Invalid guest search filters.", 400);

    await connectToDatabase();
    const filter: Record<string, unknown> = {};
    if (query.data.guestType) filter.guestType = query.data.guestType;
    if (query.data.invitationStatus) filter.invitationStatus = query.data.invitationStatus;
    if (query.data.search) {
      const escaped = query.data.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { primaryGuestName: { $regex: escaped, $options: "i" } },
        { secondaryGuestName: { $regex: escaped, $options: "i" } },
        { familyName: { $regex: escaped, $options: "i" } },
      ];
    }

    const skip = (query.data.page - 1) * query.data.limit;
    const [guests, total] = await Promise.all([
      Guest.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(query.data.limit)
        .lean(),
      Guest.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: { guests: guests.map((guest) => safeGuest(guest)), page: query.data.page, limit: query.data.limit, total },
    });
  } catch (error) {
    console.error("Listing guests failed:", error);
    return jsonError("Unable to retrieve guests.", 500);
  }
}

export async function POST(request: Request) {
  if (!verifySameOrigin(request)) return jsonError("Invalid request origin.", 403);
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const body = await readJson(request);
    if (body.error) return body.error;
    const parsed = guestInputSchema.safeParse(body.data);
    if (!parsed.success) return jsonError("Guest information is invalid.", 400);

    await connectToDatabase();
    await Guest.init();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) throw new Error("NEXT_PUBLIC_APP_URL is not configured.");
    const baseUrl = new URL(appUrl);

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const token = createInvitationToken();
      try {
        const guest = await Guest.create({
          ...parsed.data,
          invitationTokenHash: hashInvitationToken(token),
          invitationStatus: "active",
        });
        const invitationUrl = new URL(`/invite/${token}`, baseUrl).toString();
        return NextResponse.json({
          success: true,
          data: { guest: safeGuest(guest.toObject()), invitationUrl },
        }, { status: 201 });
      } catch (error) {
        if (
          attempt < 2 &&
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === 11000
        ) continue;
        throw error;
      }
    }
    throw new Error("Could not create a unique invitation token.");
  } catch (error) {
    console.error("Creating guest failed:", error);
    return jsonError("Unable to create guest.", 500);
  }
}
