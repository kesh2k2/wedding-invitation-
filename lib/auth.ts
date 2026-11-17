import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { connectToDatabase } from "@/lib/mongodb";
import Admin from "@/models/Admin";

const SESSION_COOKIE = "wedding_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || Buffer.byteLength(secret) < 32) {
    throw new Error("SESSION_SECRET must contain at least 32 bytes.");
  }
  return new TextEncoder().encode(secret);
}

export async function createAdminSession(adminId: string) {
  const session = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(adminId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSessionSecret());

  (await cookies()).set(SESSION_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function clearAdminSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function getAuthenticatedAdmin() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const secret = getSessionSecret();
  let subject: string;
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });
    if (payload.role !== "admin" || !payload.sub) return null;
    subject = payload.sub;
  } catch {
    return null;
  }

  await connectToDatabase();
  return await Admin.findById(subject).select("name email").lean();
}
