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
  image: {
    type: String,
  },
  provider: {
    type: String,
    enum: ["google"],
    default: "google",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  onboardingCompleted: {
    type: Boolean,
    default: false,
  },
  onboardingStep: {
    type: Number,
    default: 0,
  },
  businessName: {
    type: String,
  },
  businessType: {
    type: String,
  },
  services: [{
    type: String,
  }],
  serviceArea: {
    type: String,
  },
  address: {
    type: String,
  },
  businessHours: {
    open: { type: String },
    close: { type: String },
    days: [String],
  },
  emergencyService: {
    type: Boolean,
    default: false,
  },
  aiInstructions: {
    type: String,
  },
  aiTone: {
    type: String,
    default: "professional",
  },
  phoneNotifications: {
    callbacks: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
  },
  phoneStatus: {
    type: String,
    enum: ["not_connected", "pending", "connected"],
    default: "not_connected",
  },
  phoneNumber: {
    type: String,
  },
  phoneConnectedAt: {
    type: Date,
  },
  hasPaid: {
    type: Boolean,
    default: false,
  },
  plan: {
    type: String,
    default: "pro",
  },
  paymentDate: {
    type: Date,
  },
  dodoCustomerId: {
    type: String,
  },
  lastPaymentId: {
    type: String,
  },
  dodoCheckoutSessionId: {
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
  goals: [{
    type: String,
  }],
  alertFrequency: {
    type: String,
  },
  alertDelivery: {
    type: String,
  },
  sideHustleProfile: {
    monthlyIncomeGoal: { type: String },
    weeklyTimeCommitment: { type: String },
    startupCapital: { type: String },
    skills: [{ type: String }],
    willingToLearn: { type: Boolean, default: false },
    comfortableWithPeople: { type: String },
    languages: [{ type: String }],
    interests: [{ type: String }],
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
