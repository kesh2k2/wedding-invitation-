import mongoose from "mongoose";
import { hash } from "bcryptjs";

const { MONGODB_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
if (!MONGODB_URI || !ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error("Set MONGODB_URI, ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD before initialization.");
}
if (ADMIN_PASSWORD.length < 12) {
  throw new Error("ADMIN_PASSWORD must be at least 12 characters.");
}

try {
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  const admins = mongoose.connection.db.collection("admins");
  await admins.createIndex({ email: 1 }, { unique: true });

  if (await admins.countDocuments({}) > 0) {
    throw new Error("An admin already exists; initialization is one-time only.");
  }

  await admins.insertOne({
    _id: "primary",
    name: ADMIN_NAME.trim(),
    email: ADMIN_EMAIL.trim().toLowerCase(),
    password: await hash(ADMIN_PASSWORD, 12),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log("Admin account initialized.");
} finally {
  await mongoose.disconnect();
}
