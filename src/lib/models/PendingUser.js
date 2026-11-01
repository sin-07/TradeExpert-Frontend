import mongoose from 'mongoose';

const pendingUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String },
  otpExpiry: { type: Date },
  createdAt: { type: Date, default: Date.now, expires: 3600 },
});

export default mongoose.models.PendingUser || mongoose.model('PendingUser', pendingUserSchema);

