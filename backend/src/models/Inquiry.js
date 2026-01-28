import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },
    source: {
        type: String,
        default: "website"
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Inquiry", inquirySchema);
