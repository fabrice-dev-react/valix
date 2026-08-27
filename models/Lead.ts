import mongoose from "mongoose";

export type LeadStatus = "new" | "hot" | "warm" | "contacted" | "lost";

const leadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  name: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
  },
  missedAt: {
    type: Date,
    default: Date.now,
  },
  lastContactedAt: {
    type: Date,
  },
  summary: {
    type: String,
  },
  intent: {
    type: String,
  },
  nextBestAction: {
    type: String,
  },
  conversation: [
    {
      role: {
        type: String,
        enum: ["caller", "ai"],
      },
      text: {
        type: String,
      },
      at: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  status: {
    type: String,
    enum: ["new", "hot", "warm", "contacted", "lost"],
    default: "new",
    index: true,
  },
  timeline: [
    {
      type: {
        type: String,
        enum: ["call", "message", "note", "conversation", "status"],
      },
      title: {
        type: String,
      },
      detail: {
        type: String,
      },
      at: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

leadSchema.index({ userId: 1, missedAt: -1 });

const Lead = mongoose.models.Lead || mongoose.model("Lead", leadSchema);

export default Lead;
