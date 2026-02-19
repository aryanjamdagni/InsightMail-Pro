import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    userEmail: { type: String, required: true },
    source: { type: String, enum: ["text", "image", "pdf", "voice"], required: true },
    inputPreview: { type: String, default: "" },
    timeTakenSec: { type: Number, default: 0 },
    sentiment: { type: String, default: "Neutral" },
    multiIntent: { type: Boolean, default: false },
    multiLingual: { type: Boolean, default: false },
    llm: { type: String, default: "unknown" },
    responseMarkdown: { type: String, default: "" },
    approved: { type: Boolean, default: false },
    approvedAt: { type: Date },
    approvedMarkdown: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Activity", ActivitySchema);
