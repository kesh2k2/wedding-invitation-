import { createHash } from "node:crypto";
import { connectToDatabase } from "@/lib/mongodb";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export async function allowLoginAttempt(email: string, address: string) {
  const connection = await connectToDatabase();
  const collection = connection.connection.db!.collection<{
    _id: string;
    attempts: number;
    windowStartedAt: Date;
    expiresAt: Date;
  }>("login_attempts");
  await collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

  const now = new Date();
  const threshold = new Date(now.getTime() - WINDOW_MS);

  const keys = ["email", "address"].map((kind) =>
    createHash("sha256").update(`${kind}\n${kind === "email" ? email.toLowerCase() : address}`).digest("hex"),
  );
  let allowed = true;

  for (const key of keys) {
    const result = await collection.findOneAndUpdate(
      { _id: key },
      [
        {
          $set: {
            attempts: {
              $cond: [
                { $lt: [{ $ifNull: ["$windowStartedAt", new Date(0)] }, threshold] },
                1,
                { $add: [{ $ifNull: ["$attempts", 0] }, 1] },
              ],
            },
            windowStartedAt: {
              $cond: [
                { $lt: [{ $ifNull: ["$windowStartedAt", new Date(0)] }, threshold] },
                now,
                "$windowStartedAt",
              ],
            },
            expiresAt: new Date(now.getTime() + WINDOW_MS * 2),
          },
        },
      ],
      { upsert: true, returnDocument: "after" },
    );
    if (Number(result?.attempts ?? 0) > MAX_ATTEMPTS) allowed = false;
  }
  return allowed;
}
