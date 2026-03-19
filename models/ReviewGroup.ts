import mongoose from "mongoose";

const reviewGroupSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  platform: {
    type: String,
    required: true,
  },
  issueType: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  sentiment: {
    type: String,
    enum: ["positive", "negative", "neutral"],
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "RawReview",
  }],
  reviewIds: [{
    type: String,
  }],
  clusterKeywords: [{
    type: String,
  }],
  avgRating: {
    type: Number,
    default: 0,
  },
  sentimentBreakdown: {
    positive: { type: Number, default: 0 },
    negative: { type: Number, default: 0 },
    neutral: { type: Number, default: 0 },
  },
  sourceReliability: {
    type: Number,
    default: 1,
  },
  recencyScore: {
    type: Number,
    default: 0,
  },
  importanceScore: {
    type: Number,
    default: 0,
  },
  aiAdvice: {
    type: String,
  },
  priority: {
    type: String,
    enum: ["High", "Medium", "Low"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ReviewGroup = mongoose.models.ReviewGroup || mongoose.model("ReviewGroup", reviewGroupSchema);

export default ReviewGroup;
