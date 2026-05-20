const mongoose = require('mongoose');

const forgotPasswordSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    accountType: {
      type: String,
      enum: ['user', 'admin'],
      required: true,
      index: true,
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    usedAt: {
      type: Date,
      default: null,
      index: true,
    },
    attempts: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
);

forgotPasswordSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
forgotPasswordSchema.index({ email: 1, accountType: 1, createdAt: -1 });

module.exports = mongoose.model('ForgotPassword', forgotPasswordSchema, 'ForgotPassword');
