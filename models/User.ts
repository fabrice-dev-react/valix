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
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
