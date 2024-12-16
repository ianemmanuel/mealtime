import mongoose from "mongoose"

const mealSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    description: { type: String, trim: true },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    price: {
      amount: { type: Number, required: true },
      currency: { type: String, default: "USD" },
    },
    availability: {
      type: String,
      enum: ["available", "out_of_stock", "seasonal"],
      default: "available",
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    dietaryPreferences: [{ type: String, trim: true }],
    nutritionalInfo: [
      {
        name: { type: String, required: true }, // e.g., "Calories", "Protein", "Sodium"
        value: { type: String, required: true }, // e.g., "200 kcal", "10g", "500mg"
      },
    ],
    ingredients: [String], // Open-ended list of ingredients
    images: [
      {
        url: { type: String },
        alt: { type: String },
      },
    ],
    preparationTime: { type: Number, default: 0 }, // In minutes
    tags: [String], // For searchability (e.g., "spicy", "comfort food")
    ratings: {
      averageRating: { type: Number, default: 0 },
      totalRatings: { type: Number, default: 0 },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

const Meal = mongoose.model("Meal", mealSchema)

export default Meal
