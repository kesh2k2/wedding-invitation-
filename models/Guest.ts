import { model, models, Schema, type InferSchemaType } from "mongoose";

export type GuestType = "individual" | "family" | "couple";
export type InvitationStatus = "active" | "revoked";

const guestSchema = new Schema(
  {
    guestType: { type: String, enum: ["individual", "family", "couple"], required: true },
    primaryGuestName: { type: String, required: true, trim: true, maxlength: 100 },
    secondaryGuestName: { type: String, trim: true, maxlength: 100 },
    familyName: { type: String, trim: true, maxlength: 100 },
    email: { type: String, trim: true, lowercase: true, maxlength: 254 },
    phone: { type: String, trim: true, maxlength: 40 },
    invitationTokenHash: {
      type: String,
      required: true,
      unique: true,
      select: false,
      match: /^[a-f0-9]{64}$/,
    },
    invitationStatus: { type: String, enum: ["active", "revoked"], default: "active", required: true },
  },
  { timestamps: true, versionKey: false },
);

guestSchema.pre("validate", function () {
  if (this.guestType === "couple" && !this.secondaryGuestName) {
    this.invalidate("secondaryGuestName", "A couple invitation requires a secondary guest name.");
  }
  if (this.guestType !== "couple" && this.secondaryGuestName) {
    this.invalidate("secondaryGuestName", "Only couple invitations may have a secondary guest name.");
  }
  if (this.guestType !== "family" && this.familyName) {
    this.invalidate("familyName", "Only family invitations may have a family name.");
  }
});

guestSchema.index({ primaryGuestName: 1 });
guestSchema.index({ guestType: 1, invitationStatus: 1 });

export type GuestDocument = InferSchemaType<typeof guestSchema>;
const Guest = models.Guest || model("Guest", guestSchema);
export default Guest;
