const Joi = require('joi');

const adminRoles = [
  'super_admin',
  'content_manager',
  'user_manager',
  'finance_manager',
  'ai_engineer',
  'analyst',
];

const email = Joi.string().trim().lowercase().email().required();
const password = Joi.string().min(8).max(128).required();
const otp = Joi.string().pattern(/^\d{6}$/).required().messages({
  'string.pattern.base': 'OTP must be exactly 6 digits',
});

const userRegisterSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  email,
  password,
});

const adminRegisterSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  email,
  password,
  adminRole: Joi.string().valid(...adminRoles).default('analyst'),
  inviteCode: Joi.string().trim().required(),
});

const loginSchema = Joi.object({
  email,
  password: Joi.string().required(),
});

const forgotPasswordSchema = Joi.object({
  email,
});

const verifyOtpSchema = Joi.object({
  email,
  otp,
});

const resetPasswordSchema = Joi.object({
  email,
  otp,
  newPassword: password,
});

module.exports = {
  userRegisterSchema,
  adminRegisterSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyOtpSchema,
  resetPasswordSchema,
  adminRoles,
};
