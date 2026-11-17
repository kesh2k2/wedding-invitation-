import assert from "node:assert/strict";
import test from "node:test";
import { createGreeting } from "../lib/greetings.ts";
import { createInvitationToken, hashInvitationToken } from "../lib/token.ts";

test("creates the expected guest greetings", () => {
  assert.equal(createGreeting({ guestType: "individual", primaryGuestName: "Mahesh" }), "Dear Mahesh,");
  assert.equal(createGreeting({ guestType: "family", primaryGuestName: "Mahesh" }), "Dear Mahesh and Family,");
  assert.equal(
    createGreeting({ guestType: "couple", primaryGuestName: "Mahesh", secondaryGuestName: "Amaya" }),
    "Dear Mahesh & Amaya,",
  );
});

test("invitation tokens are unique and stored as one-way SHA-256 hashes", () => {
  const first = createInvitationToken();
  const second = createInvitationToken();
  assert.match(first, /^[A-Za-z0-9_-]{43}$/);
  assert.notEqual(first, second);
  assert.match(hashInvitationToken(first), /^[a-f0-9]{64}$/);
  assert.notEqual(hashInvitationToken(first), first);
  assert.equal(hashInvitationToken(first), hashInvitationToken(first));
});
