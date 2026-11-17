export interface WeddingInfo {
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingTime: string;
  venueName: string;
  venueAddress: string;
  googleMapsUrl: string;
  dressCode: string;
  weddingDescription: string;
}

export interface PublicInvitation {
  guest: {
    guestType: "individual" | "family" | "couple";
    greeting: string;
  };
  wedding: WeddingInfo;
}
