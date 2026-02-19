import mongoose from "mongoose";

const UsageEntrySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    userName: { type: String, default: "" },
    userEmail: { type: String, required: true },

    activityId: { type: mongoose.Schema.Types.ObjectId, ref: "Activity" },

    process: {
      type: String,
      enum: ["analyze_text", "analyze_image", "analyze_pdf", "analyze_voice"],
      required: true,
    },

    tokensIn: { type: Number, default: null },
    tokensOut: { type: Number, default: null },

    costUSD: { type: Number, default: 0 },
    model: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("UsageEntry", UsageEntrySchema);
