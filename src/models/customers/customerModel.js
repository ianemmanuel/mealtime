import mongoose from "mongoose";

// Reusable Address Schema
const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String },
  zipCode: { type: String },
  country: { type: String, required: true }
}, { _id: false }); // Prevent creating a separate ID for this sub-schema


const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  location: { type: String },
  address: addressSchema, 
  refreshToken: { type: String },
  role: { 
    type: String, 
    enum: ["user"], 
    default: "user" // Only "user" for this schema
  },
  isActive: { type: Boolean, default: true },
  subscription: [
    {
    planId: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription" }, // Reference to Subscription Model
    startDate: Date,
    endDate: Date,
    isActive: { type: Boolean, default: true },
    preferences: [String]
    }
  ],
  profile: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Profile" 
  },
}, { timestamps: true });

export const Customer = mongoose.model("Customer", customerSchema);
