import mongoose from "mongoose";

// Main Subscription Schema
const subscriptionSchema = new mongoose.Schema({
    restaurantId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Restaurant", 
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    }, // e.g., "Weekly Vegan Plan"
    description: { 
        type: String 
    }, // Details about the subscription
    price: { 
        type: Number, 
        required: true 
    }, // Total price for the plan
    duration: { 
        type: String, 
        enum: ["weekly", "monthly"], 
        required: true 
    },
    meals: [
        {
            mealId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: "Meal" 
            },
            day: { 
                type: String, 
                enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] 
            }
        }
    ], // Specific meals for each day
    isActive: { 
        type: Boolean, 
        default: true 
    } // If the subscription is currently being offered
}, { timestamps: true });

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
