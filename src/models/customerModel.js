import mongoose from "mongoose";

// Reusable Address Schema
const addressSchema = new mongoose.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String, required: true }
}, { _id: false }); // Prevent creating a separate ID for this sub-schema

// Main Customer Schema
const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: addressSchema, // Embed Address Schema
    role: { 
        type: String, 
        enum: ["user"], 
        default: "user" // Only "user" for this schema
    },
    isActive: { type: Boolean, default: true },

    // Social Features
    reviews: [
        {
            restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
            rating: { type: Number, min: 1, max: 5 },
            comment: String,
            createdAt: { type: Date, default: Date.now },
            updatedAt: { type: Date, default: Date.now }
        }
    ],
    sharedMeals: [
        {
            mealId: { type: mongoose.Schema.Types.ObjectId, ref: "Meal" },
            sharedWith: [String], // Social media handles or emails
            sharedAt: { type: Date, default: Date.now }
        }
    ],

    // Subscriptions
    subscription: {
        planId: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription" }, // Reference to Subscription Model
        startDate: Date,
        endDate: Date,
        isActive: { type: Boolean, default: true },
        preferences: [String] // Dietary preferences like "vegan", "gluten-free"
    },

    // Loyalty Program
    loyaltyPoints: { type: Number, default: 0 },

    // Notifications
    notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        app: { type: Boolean, default: true }
    },

    // Group Subscriptions
    groups: [
        {
            groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
            role: { type: String, enum: ["admin", "member"], default: "member" },
            joinedAt: { type: Date, default: Date.now }
        }
    ],
    
}, { timestamps: true });

export const Customer = mongoose.model("Customer", customerSchema);
