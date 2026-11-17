import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { createGreeting } from "@/lib/greetings";
import { hashInvitationToken } from "@/lib/token";
import { jsonError, safeWedding } from "@/lib/http";
import Guest from "@/models/Guest";
import Wedding from "@/models/Wedding";

type RouteContext = { params: Promise<{ token: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  void _request.url;
  try {
    const { token } = await params;
    if (!/^[A-Za-z0-9_-]{43}$/.test(token)) return jsonError("Invitation not found.", 404);

    await connectToDatabase();
    const guest = await Guest.findOne({
      invitationTokenHash: hashInvitationToken(token),
      invitationStatus: "active",
    })
      .select("guestType primaryGuestName secondaryGuestName")
      .lean();
    if (!guest) return jsonError("Invitation not found.", 404);

    const wedding = await Wedding.findById("primary").lean();
    if (!wedding) return jsonError("Invitation not found.", 404);

    return NextResponse.json({
      success: true,
      data: {
        guest: { guestType: guest.guestType, greeting: createGreeting(guest) },
        wedding: safeWedding(wedding),
      },
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Loading public invitation failed:", error);
    return jsonError("Unable to load this invitation.", 500);
  }
}
