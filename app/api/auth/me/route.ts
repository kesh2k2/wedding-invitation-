import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { jsonError } from "@/lib/http";

export async function GET(request: Request) {
  void request.url;
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) return jsonError("Authentication required.", 401);
    return NextResponse.json({
      success: true,
      data: { admin: { id: String(admin._id), name: admin.name, email: admin.email } },
    });
  } catch (error) {
    console.error("Reading admin session failed:", error);
    return jsonError("Unable to read the current session.", 500);
  }
}
