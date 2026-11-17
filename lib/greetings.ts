import type { GuestType } from "@/models/Guest";

export function createGreeting(guest: {
  guestType: GuestType;
  primaryGuestName: string;
  secondaryGuestName?: string;
}) {
  if (guest.guestType === "couple" && guest.secondaryGuestName) {
    return `Dear ${guest.primaryGuestName} & ${guest.secondaryGuestName},`;
  }

  if (guest.guestType === "family") {
    return `Dear ${guest.primaryGuestName} and Family,`;
  }

  return `Dear ${guest.primaryGuestName},`;
}
