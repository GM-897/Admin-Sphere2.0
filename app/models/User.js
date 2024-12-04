import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
