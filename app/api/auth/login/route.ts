import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { createAdminSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { allowLoginAttempt } from "@/lib/rate-limit";
import { jsonError, readJson, verifySameOrigin } from "@/lib/http";
import { loginSchema } from "@/lib/validations/auth";
import Admin from "@/models/Admin";

export async function POST(request: Request) {
  if (!verifySameOrigin(request)) return jsonError("Invalid request origin.", 403);
  const parsedBody = await readJson(request);
  if (parsedBody.error) return parsedBody.error;

  const parsed = loginSchema.safeParse(parsedBody.data);
  if (!parsed.success) return jsonError("Invalid email or password.", 400);

  try {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const address = forwardedFor?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip")?.trim() ||
      "unknown";
    if (!await allowLoginAttempt(parsed.data.email, address)) {
      return jsonError("Too many login attempts. Try again in 15 minutes.", 429);
    }

    await connectToDatabase();
    const admin = await Admin.findOne({ email: parsed.data.email }).select("+password");
    const validPassword = admin
      ? await compare(parsed.data.password, admin.password)
      : await compare(parsed.data.password, "$2b$12$invalid.hash.to.equalize.login.timing");

    if (!admin || !validPassword) return jsonError("Invalid email or password.", 401);

    await createAdminSession(admin.id);
    return NextResponse.json({
      success: true,
      data: { admin: { id: admin.id, name: admin.name, email: admin.email } },
    });
  } catch (error) {
    console.error("Admin login failed:", error);
    return jsonError("Unable to complete login.", 500);
  }
}
