import { model, models, Schema, type InferSchemaType } from "mongoose";

const adminSchema = new Schema(
  {
    _id: { type: String, default: "primary" },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
    password: {
      type: String,
      required: true,
      select: false,
      match: /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/,
    },
  },
  { timestamps: true, versionKey: false },
);

export type AdminDocument = InferSchemaType<typeof adminSchema>;
const Admin = models.Admin || model("Admin", adminSchema);
export default Admin;
