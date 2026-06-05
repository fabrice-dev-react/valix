import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  onboardingCompleted: {
    type: Boolean,
    default: false,
  },
  competitors: [{
    name: { type: String },
    website: { type: String },
    addedAt: { type: Date, default: Date.now },
  }],
  customCompetitors: [{
    name: { type: String },
    url: { type: String },
    domain: { type: String },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
  verifiedAt: {
    type: Date,
  },
  provider: {
    type: String,
    enum: ["credentials", "google"],
    default: "credentials",
  },
  image: {
    type: String,
  },
  plan: {
    type: String,
    enum: ["free", "starter", "growth", "book"],
    default: "free",
  },
  paymentDate: {
    type: Date,
  },
  nextResetDate: {
    type: Date,
  },
  subscriptionId: {
    type: String,
  },
  paddleCustomerId: {
    type: String,
  },
  websiteUrl: {
    type: String,
  },
  productName: {
    type: String,
  },
  productDescription: {
    type: String,
  },
  category: {
    type: String,
  },
  targetCustomers: {
    type: String,
  },
  keyFeatures: [{
    type: String,
  }],
  pricing: {
    type: String,
  },
  platforms: [{
    type: String,
  }],
  goals: [{
    type: String,
  }],
  alertFrequency: {
    type: String,
  },
  alertDelivery: {
    type: String,
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
