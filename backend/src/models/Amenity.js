import mongoose from "mongoose";

const amenitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true,trim: true, unique: true },
    icon: { type: String },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Amenity", amenitySchema);
