const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: {
    type: String,
    required: true,
  },
  otpCreatedAt: {
    type: Date,
    default: Date.now,
    index: { expires: '1m' }, // TTL index for OTP creation date
  },
  password: { type: String },
  verified: { type: Boolean },
  companyName: { type: String },
  companyWebsite: { type: String },
  credits: { type: Number, default: 100 },
  spentCredits: { type: Array },
});

// Create the TTL index on otpCreatedAt explicitly
CompanySchema.index({ otpCreatedAt: 1 }, { expireAfterSeconds: 60 });

module.exports = mongoose.model("Company", CompanySchema);
