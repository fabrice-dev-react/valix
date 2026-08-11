import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    default: "",
  },
  whatsapp: {
    type: String,
    default: "",
  },
  date: {
    type: String,
    required: true,
  },
  slot: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    default: "WhatsApp AI consultation",
  },
  status: {
    type: String,
    enum: ["booked", "cancelled"],
    default: "booked",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

meetingSchema.index({ date: 1, slot: 1 }, { unique: true });

const Meeting = mongoose.models.Meeting || mongoose.model("Meeting", meetingSchema);

export default Meeting;
