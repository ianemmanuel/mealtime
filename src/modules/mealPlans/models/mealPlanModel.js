import mongoose from "mongoose";

const mealPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, trim: true },
    slug: { type: String, unique: true, required: true },
    restaurant: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Restaurant", 
      required: true 
    },
    discount: { 
      type: Number, 
      default: 0 
    },
    price: {
      amount: { type: Number, required: true },
      currency: { type: String, default: "USD" },
    },
    meals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Meal",
        required: true,
      },
    ],
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    images: [
      {
        url: {
          type: String,
          trim: true,
        },
      },
    ],
    startDate: { 
      type: Date, 
      required: true 
    },
    endDate: { 
      type: Date, 
      required: true 
    },
    isRecurring: { 
      type: Boolean, 
      default: false 
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "active", "completed", "canceled"],
      default: "pending",
    },
    isPublic: { 
      type: Boolean, 
      default: false 
    },
    isPublished: { 
      type: Boolean, 
      default: false 
    },
    isFeatured: { 
      type: Boolean, 
      default: false 
    },
    isDeleted: { 
      type: Boolean, 
      default: false 
    },
  },
  { timestamps: true }
)

// Indexing for efficient querying

//? 1. Query by slug (unique identifier)
mealPlanSchema.index({ slug: 1 })

//? 2. Query by restaurant for meal plans belonging to a specific restaurant
mealPlanSchema.index({ restaurant: 1 })

//? 3. Compound index for querying by status and startDate, e.g., for active or scheduled meal plans
mealPlanSchema.index({ status: 1, startDate: 1 })

//? 4. Query by price (for filtering meal plans based on pricing)
mealPlanSchema.index({ "price.amount": 1 })

//? 5. Compound index for retrieval by categories (e.g., filtering meal plans by tags) and published status
mealPlanSchema.index({ categories: 1, isPublished: 1 });

//? 6. Index for featured meal plans to prioritize sorting or highlighting featured content
mealPlanSchema.index({ isFeatured: 1 })

//? 7. Query by activity state (active or deleted) to filter out soft-deleted meal plans
mealPlanSchema.index({ isActive: 1, isDeleted: 1 })

//? 8. Index for searching meal plans by name, description, or tags
mealPlanSchema.index({ tags: 1 })
mealPlanSchema.index({ name: 1 })
mealPlanSchema.index({ name: 1, tags: 1 })


const MealPlan = mongoose.model("MealPlan", mealPlanSchema)

export default MealPlan;
