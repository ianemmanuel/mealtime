import mongoose from "mongoose";

const mealPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, trim: true },
    slug: { type: String, unique: true, required: true },
    meals: [
      {
        meal: { type: mongoose.Schema.Types.ObjectId, ref: "Meal", required: true },
        quantity: { type: Number, default: 1, min: 1 }, // Number of this meal in the plan
      },
    ],
    price: {
      amount: { type: Number, required: true },
      currency: { type: String, default: "USD" },
    },
    duration: {
      type: String, // e.g., "weekly", "monthly", or "custom"
      enum: ["daily", "weekly", "monthly", "custom"],
      required: true,
    },
    isActive: { type: Boolean, default: true }, // Indicates if the meal plan is currently offered
    discount: {
      percentage: { type: Number, min: 0, max: 100 },
      description: { type: String },
    },
    customizationOptions: {
      allowMealSwap: { type: Boolean, default: false }, // Allow customers to swap meals
      maxSwaps: { type: Number, default: 0 }, // Maximum swaps allowed
    },
    deliveryOptions: {
      frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly", "custom"],
        default: "weekly",
      },
      deliveryTimes: [String], 
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

const MealPlan = mongoose.model("MealPlan", mealPlanSchema);

export default MealPlan;
