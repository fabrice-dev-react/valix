import mongoose from "mongoose";

const complaintIssueSchema = new mongoose.Schema({
  issueText: { type: String, required: true },
  sentiment: { type: String, enum: ["positive", "negative", "neutral"] },
  severity: { type: Number, default: 0 },
  keywords: [{ type: String }],
});

const rawReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  platform: {
    type: String,
    required: true,
  },
  competitorName: {
    type: String,
  },
  competitorDomain: {
    type: String,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  reviewText: {
    type: String,
    required: true,
  },
  reviewerName: {
    type: String,
  },
  reviewDate: {
    type: Date,
  },
  sentiment: {
    type: String,
    enum: ["positive", "negative", "neutral"],
  },
  sentimentScore: {
    type: Number,
    default: 0,
  },
  extractedIssues: [complaintIssueSchema],
  clusterId: {
    type: String,
  },
  clusterLabel: {
    type: String,
  },
  sourceUrl: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  helpfulCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  fetchedAt: {
    type: Date,
    default: Date.now,
  },
});

rawReviewSchema.index({ userId: 1, platform: 1 });
rawReviewSchema.index({ clusterId: 1 });
rawReviewSchema.index({ sentiment: 1 });
rawReviewSchema.index({ competitorDomain: 1 });

const RawReview = mongoose.models.RawReview || mongoose.model("RawReview", rawReviewSchema);

export default RawReview;
