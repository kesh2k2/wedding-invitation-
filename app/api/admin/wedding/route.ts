import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { jsonError, readJson, requireAdmin, safeWedding, verifySameOrigin } from "@/lib/http";
import { weddingInputSchema } from "@/lib/validations/wedding";
import Wedding from "@/models/Wedding";

export async function GET(request: Request) {
  void request.url;
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;
    await connectToDatabase();
    const wedding = await Wedding.findById("primary").lean();
    return NextResponse.json({ success: true, data: { wedding: safeWedding(wedding) } });
  } catch (error) {
    console.error("Reading admin wedding data failed:", error);
    return jsonError("Unable to retrieve wedding information.", 500);
  }
}

export async function POST(request: Request) {
  return saveWedding(request, false);
}

export async function PUT(request: Request) {
  return saveWedding(request, true);
}

async function saveWedding(request: Request, update: boolean) {
  if (!verifySameOrigin(request)) return jsonError("Invalid request origin.", 403);
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;
    const body = await readJson(request);
    if (body.error) return body.error;
    const parsed = weddingInputSchema.safeParse(body.data);
    if (!parsed.success) return jsonError("Wedding information is invalid.", 400);

    await connectToDatabase();
    if (update) {
      const wedding = await Wedding.findByIdAndUpdate(
        "primary",
        parsed.data,
        { returnDocument: "after", runValidators: true, upsert: true, setDefaultsOnInsert: true },
      ).lean();
      return NextResponse.json({ success: true, data: { wedding: safeWedding(wedding) } });
    }

    const wedding = await Wedding.create({ _id: "primary", ...parsed.data });
    return NextResponse.json({ success: true, data: { wedding: safeWedding(wedding.toObject()) } }, { status: 201 });
  } catch (error) {
    if (!update && typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
      return jsonError("Wedding information already exists. Use PUT to update it.", 409);
    }
    console.error("Saving wedding information failed:", error);
    return jsonError("Unable to save wedding information.", 500);
  }
}
