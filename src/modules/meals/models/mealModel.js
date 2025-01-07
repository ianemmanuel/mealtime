import mongoose from "mongoose"

const mealSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true }, // Useful for SEO-friendly URLs
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
      days: [{ type: String, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] }],
      time: [{ type: String }], // E.g., "12:00 PM - 9:00 PM"
    },
    status: {
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
    variants: [
      {
        name: { type: String, required: true }, //* Variant name (e.g., "Large", "Small")
        price: { type: Number, required: true }, //* Variant-specific price
        stockLevel: { type: Number, default: 0 }, //* Stock tracking per variant
        availability: {
          days: [{ type: String, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] }], // Days the variant is available
          time: [{ type: String }], // Time slots (e.g., "12:00 PM - 3:00 PM")
        },
      },
    ],
    tags: [{ type: String, trim: true }], // E.g., "spicy", "vegan", "comfort food"
    dietaryPreferences: [{ type: String, trim: true }], // E.g., "Vegan", "Gluten-Free"
    nutritionalInfo: [
      {
        name: { type: String, required: true }, // E.g., "Calories", "Protein"
        value: { type: String, required: true }, // E.g., "200 kcal", "10g"
      },
    ],
    ingredients: [{ type: String, trim: true }], // Open-ended list of ingredients
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, trim: true },
      },
    ],
    preparationTime: { type: Number, default: 0 }, // In minutes
    stockLevel: { type: Number, default: 0 }, // Tracks portions available for individual purchase
    ratings: {
      averageRating: { type: Number, default: 0 },
      totalRatings: { type: Number, default: 0 },
    },
    isFeatured: { type: Boolean, default: false }, // Highlighted meals
    isActive: { type: Boolean, default: true }, // Toggle meal availability
  },
  { timestamps: true }
)

//* Add a compound index to ensure slug is unique per restaurant
mealSchema.index({ slug: 1, restaurant: 1 }, { unique: true });

const Meal = mongoose.model("Meal", mealSchema);

export default Meal
