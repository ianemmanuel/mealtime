import mongoose from "mongoose";

const restaurantProfileSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    slug: { type: String, unique: true, required: true },
    description: { type: String, trim: true },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
      },
    ],
    logo: { type: String },
    banner: { type: String },
    theme: { type: String, default: "default" },
    loyaltyProgram: {
      enabled: {
        type: Boolean,
        default: false,
      },
      rewards: [
        {
          points: { type: Number },
          reward: { type: String },
        },
      ],
    },
    socialLinks: {
      website: { type: String },
      facebook: { type: String },
      instagram: { type: String },
      X: { type: String },
      tiktok: { type: String },
      otherLinks: [
        {
          label: { type: String }, // Descriptive label for the link
          url: { type: String }, // URL for the custom link
        },
      ],
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

const RestaurantProfile = mongoose.model("RestaurantProfile", restaurantProfileSchema)

export default RestaurantProfile
