import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { jsonError, safeWedding } from "@/lib/http";
import Wedding from "@/models/Wedding";

export async function GET(request: Request) {
  void request.url;
  try {
    await connectToDatabase();
    const wedding = await Wedding.findById("primary").lean();
    return NextResponse.json({ success: true, data: { wedding: safeWedding(wedding) } }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Reading public wedding information failed:", error);
    return jsonError("Unable to retrieve wedding information.", 500);
  }
}
