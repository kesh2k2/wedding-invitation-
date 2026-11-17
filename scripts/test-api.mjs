import { randomBytes } from "node:crypto";
import { spawn } from "node:child_process";
import net from "node:net";
import mongoose from "mongoose";

const sourceUri = process.env.MONGODB_URI;
if (!sourceUri) throw new Error("Set MONGODB_URI before running integration tests.");

const sourceUrl = new URL(sourceUri);
const databaseName = `wi_test_${randomBytes(12).toString("hex")}`;
sourceUrl.pathname = `/${databaseName}`;
const testUri = sourceUrl.toString();
const email = `admin-${randomBytes(6).toString("hex")}@example.test`;
const password = `Test-${randomBytes(18).toString("base64url")}!`;
const secret = randomBytes(48).toString("base64url");
let server;
let sessionCookie = "";
let serverOutput = "";

function run(command, args, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { env, stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    child.stdout.on("data", (chunk) => { output += chunk; });
    child.stderr.on("data", (chunk) => { output += chunk; });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve(output);
      else reject(new Error(output || `${command} exited with status ${code}.`));
    });
  });
}

async function getFreePort() {
  const listener = net.createServer();
  await new Promise((resolve, reject) => listener.listen(0, "127.0.0.1", resolve).on("error", reject));
  const address = listener.address();
  if (!address || typeof address === "string") throw new Error("Could not allocate a test port.");
  await new Promise((resolve, reject) => listener.close((error) => error ? reject(error) : resolve()));
  return address.port;
}

async function request(path, { method = "GET", data, authenticated = true } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      origin: baseUrl,
      ...(data === undefined ? {} : { "content-type": "application/json" }),
      ...(authenticated && sessionCookie ? { cookie: sessionCookie } : {}),
    },
    body: data === undefined ? undefined : JSON.stringify(data),
  });
  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error(`Endpoint returned a non-JSON response (${response.status}).`);
  }
  return { response, payload };
}

async function expectStatus(path, options, status) {
  const result = await request(path, options);
  if (result.response.status !== status) {
    throw new Error(`Expected HTTP ${status}, received HTTP ${result.response.status}.`);
  }
  return result.payload;
}

const port = await getFreePort();
const baseUrl = `http://localhost:${port}`;
const appEnv = {
  ...process.env,
  MONGODB_URI: testUri,
  SESSION_SECRET: secret,
  NEXT_PUBLIC_APP_URL: baseUrl,
  ADMIN_NAME: "Integration Admin",
  ADMIN_EMAIL: email,
  ADMIN_PASSWORD: password,
  NODE_ENV: "production",
};

try {
  await run(process.execPath, ["scripts/create-admin.mjs"], appEnv);
  server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(port)], {
    env: appEnv,
    stdio: ["ignore", "pipe", "pipe"],
  });
  server.stdout.on("data", (chunk) => { serverOutput += chunk; });
  server.stderr.on("data", (chunk) => { serverOutput += chunk; });

  let ready = false;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (server.exitCode !== null) throw new Error("Next.js server exited during startup.");
    try {
      const response = await fetch(`${baseUrl}/api/wedding`);
      if (response.ok) {
        ready = true;
        break;
      }
    } catch {
      // The server is not listening yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  if (!ready) throw new Error("Next.js server did not become ready.");

  await expectStatus("/api/auth/me", { authenticated: false }, 401);
  await expectStatus("/api/admin/guests", { authenticated: false }, 401);
  await expectStatus("/api/auth/login", {
    method: "POST",
    data: { email, password: "incorrect-password" },
    authenticated: false,
  }, 401);

  const wedding = {
    groomName: "Alex",
    brideName: "Olivia",
    weddingDate: "2026-12-20",
    weddingTime: "10:00 AM",
    venueName: "Grand Ballroom",
    venueAddress: "Kandy, Sri Lanka",
    googleMapsUrl: "https://maps.google.com/",
    dressCode: "Formal",
    weddingDescription: "A celebration with family and friends.",
  };
  await expectStatus("/api/admin/wedding", { method: "POST", data: wedding }, 401);

  const login = await request("/api/auth/login", {
    method: "POST",
    data: { email, password },
    authenticated: false,
  });
  if (login.response.status !== 200 || !login.payload.success) throw new Error("Admin login failed.");
  const setCookie = login.response.headers.get("set-cookie");
  if (!setCookie || !/httponly/i.test(setCookie) || !/samesite=lax/i.test(setCookie) || !/secure/i.test(setCookie)) {
    throw new Error("Admin login did not set a secure HTTP-only, SameSite session cookie.");
  }
  sessionCookie = setCookie.split(";")[0];

  const currentAdmin = await expectStatus("/api/auth/me", {}, 200);
  if (currentAdmin.data.admin.email !== email || "password" in currentAdmin.data.admin) {
    throw new Error("Admin session response contained unexpected data.");
  }
  await expectStatus("/api/admin/wedding", { method: "POST", data: wedding }, 201);
  const duplicateWedding = await expectStatus("/api/admin/wedding", { method: "POST", data: wedding }, 409);
  if (duplicateWedding.success) throw new Error("Duplicate wedding creation unexpectedly succeeded.");
  const updatedWedding = { ...wedding, venueName: "Updated Ballroom" };
  await expectStatus("/api/admin/wedding", { method: "PUT", data: updatedWedding }, 200);
  const publicWedding = await expectStatus("/api/wedding", { authenticated: false }, 200);
  if (publicWedding.data.wedding.venueName !== updatedWedding.venueName) {
    throw new Error("Public wedding endpoint did not return updated wedding data.");
  }

  const created = await expectStatus("/api/admin/guests", {
    method: "POST",
    data: {
      guestType: "couple",
      primaryGuestName: "Mahesh",
      secondaryGuestName: "Amaya",
      email: "mahesh@example.test",
    },
  }, 201);
  const guestId = created.data.guest.id;
  const invitationUrl = new URL(created.data.invitationUrl);
  const token = invitationUrl.pathname.split("/").at(-1);
  if (!token || "invitationTokenHash" in created.data.guest || "token" in created.data) {
    throw new Error("Guest response leaked invitation secret data.");
  }

  await mongoose.connect(testUri);
  const storedGuest = await mongoose.connection.db.collection("guests").findOne({
    _id: new mongoose.Types.ObjectId(guestId),
  });
  if (!storedGuest || storedGuest.invitationTokenHash === token) {
    throw new Error("Raw invitation token was stored instead of its hash.");
  }
  await mongoose.disconnect();
  const family = await expectStatus("/api/admin/guests", {
    method: "POST",
    data: { guestType: "family", primaryGuestName: "Mahesh", familyName: "Perera" },
  }, 201);
  const individual = await expectStatus("/api/admin/guests", {
    method: "POST",
    data: { guestType: "individual", primaryGuestName: "Nina" },
  }, 201);
  const familyToken = new URL(family.data.invitationUrl).pathname.split("/").at(-1);
  const individualToken = new URL(individual.data.invitationUrl).pathname.split("/").at(-1);
  if (new Set([token, familyToken, individualToken]).size !== 3) {
    throw new Error("Guest invitation tokens were not unique.");
  }

  const invitation = await expectStatus(`/api/invitations/${token}`, { authenticated: false }, 200);
  if (invitation.data.guest.greeting !== "Dear Mahesh & Amaya," || "email" in invitation.data.guest) {
    throw new Error("Public invitation greeting or data filtering failed.");
  }
  const familyInvitation = await expectStatus(`/api/invitations/${familyToken}`, { authenticated: false }, 200);
  const individualInvitation = await expectStatus(`/api/invitations/${individualToken}`, { authenticated: false }, 200);
  if (familyInvitation.data.guest.greeting !== "Dear Mahesh and Family," ||
      individualInvitation.data.guest.greeting !== "Dear Nina,") {
    throw new Error("Family or individual invitation greeting failed.");
  }
  await expectStatus("/api/admin/guests?guestType=couple&invitationStatus=active&search=Mahesh", {}, 200);
  await expectStatus(`/api/admin/guests/${guestId}`, {}, 200);
  await expectStatus(`/api/admin/guests/${guestId}`, {
    method: "PATCH",
    data: { primaryGuestName: "M. Mahesh" },
  }, 200);
  await expectStatus(`/api/admin/guests/${guestId}/revoke`, { method: "POST" }, 200);
  await expectStatus(`/api/invitations/${token}`, { authenticated: false }, 404);
  await expectStatus(`/api/admin/guests/${guestId}/reactivate`, { method: "POST" }, 200);
  const reactivated = await expectStatus(`/api/invitations/${token}`, { authenticated: false }, 200);
  if (reactivated.data.guest.greeting !== "Dear M. Mahesh & Amaya,") {
    throw new Error("Updated guest information was not reflected in the invitation.");
  }
  await expectStatus("/api/invitations/not-a-valid-token", { authenticated: false }, 404);
  await expectStatus(`/api/admin/guests/${guestId}`, { method: "DELETE" }, 200);
  await expectStatus(`/api/invitations/${token}`, { authenticated: false }, 404);
  await expectStatus(`/api/admin/guests/${family.data.guest.id}`, { method: "DELETE" }, 200);
  await expectStatus(`/api/admin/guests/${individual.data.guest.id}`, { method: "DELETE" }, 200);

  const logout = await request("/api/auth/logout", { method: "POST" });
  if (logout.response.status !== 200) throw new Error("Admin logout failed.");
  sessionCookie = "";
  await expectStatus("/api/auth/me", { authenticated: false }, 401);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    await expectStatus("/api/auth/login", {
      method: "POST",
      data: { email, password: "incorrect-password" },
      authenticated: false,
    }, 401);
  }
  await expectStatus("/api/auth/login", {
    method: "POST",
    data: { email, password: "incorrect-password" },
    authenticated: false,
  }, 429);

  console.log("API integration checks passed (auth, authorization, wedding, guest lifecycle, and invitation tokens).");
} catch (error) {
  if (serverOutput) console.error(serverOutput.slice(-5000));
  throw error;
} finally {
  if (server && server.exitCode === null) {
    server.kill("SIGTERM");
    await new Promise((resolve) => server.once("exit", resolve));
  }
  await mongoose.connect(testUri).catch((error) => {
    console.error("Could not reconnect to the isolated integration-test database for cleanup:", error);
  });
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase().catch((error) => {
      console.error("Could not remove the isolated integration-test database:", error);
    });
    await mongoose.disconnect();
  }
}
