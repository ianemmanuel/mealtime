import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true }, // Link to Customer
  profilePicture: { type: String },
  bio: { type: String },
  socialLinks: [{ type: String}],
  slug: { type: String, unique: true, required: true },
  //* Social Features
  restaurantReviews: [
    {
      restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    }
  ],
  mealPlanReviews: [
    { 
      mealPlanId: { type: mongoose.Schema.Types.ObjectId, ref: "MealPlan" },
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    }
  ],
  sharedMeals: [
    {
      mealPlanId: { type: mongoose.Schema.Types.ObjectId, ref: "MealPlan" },
      sharedWith: [String], // Social media handles or emails
      sharedAt: { type: Date, default: Date.now }
    }
  ],

  //!Notifications
  notifications: {
    email: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
    app: { type: Boolean, default: true }
  },

  //!Loyalty Program
  loyaltyPoints: { type: Number, default: 0 },

  // Group Subscriptions
  groups: [
    {
      groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
      role: { type: String, enum: ["admin", "member"], default: "member" },
      joinedAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

export const Profile = mongoose.model("Profile", profileSchema);
