import mongoose from "mongoose";

const competitorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    required: true,
  },
  reviews: [{
    platform: { type: String },
    rating: { type: Number },
    reviewText: { type: String },
    reviewerName: { type: String },
    date: { type: Date },
    complaintCategory: { type: String },
    extractedInsight: { type: String },
    createdAt: { type: Date, default: Date.now },
  }],
  analysisSummary: {
    type: String,
  },
  weaknesses: [{
    type: String,
  }],
  opportunities: [{
    type: String,
  }],
  lastAnalyzed: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Competitor = mongoose.models.Competitor || mongoose.model("Competitor", competitorSchema);

export default Competitor;
