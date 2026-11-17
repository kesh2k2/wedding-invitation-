import { NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/auth";
import { jsonError, verifySameOrigin } from "@/lib/http";

export async function POST(request: Request) {
  if (!verifySameOrigin(request)) return jsonError("Invalid request origin.", 403);
  await clearAdminSession();
  return NextResponse.json({ success: true });
}
