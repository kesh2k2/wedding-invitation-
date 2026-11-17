import { model, models, Schema, type InferSchemaType } from "mongoose";

const weddingSchema = new Schema(
  {
    _id: { type: String, default: "primary" },
    groomName: { type: String, required: true, trim: true, maxlength: 100 },
    brideName: { type: String, required: true, trim: true, maxlength: 100 },
    weddingDate: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    weddingTime: { type: String, required: true, trim: true, maxlength: 40 },
    venueName: { type: String, required: true, trim: true, maxlength: 150 },
    venueAddress: { type: String, required: true, trim: true, maxlength: 300 },
    googleMapsUrl: {
      type: String,
      trim: true,
      maxlength: 2048,
      default: "",
      validate: {
        validator: (value: string) => {
          if (!value) return true;
          try {
            const url = new URL(value);
            return url.protocol === "https:" &&
              ["google.com", "www.google.com", "maps.google.com", "maps.google.lk", "www.google.lk", "maps.app.goo.gl"].includes(url.hostname);
          } catch {
            return false;
          }
        },
        message: "Enter a secure Google Maps URL.",
      },
    },
    dressCode: { type: String, trim: true, maxlength: 150, default: "" },
    weddingDescription: { type: String, trim: true, maxlength: 2000, default: "" },
  },
  { timestamps: true, versionKey: false },
);

export type WeddingDocument = InferSchemaType<typeof weddingSchema>;
const Wedding = models.Wedding || model("Wedding", weddingSchema);
export default Wedding;
