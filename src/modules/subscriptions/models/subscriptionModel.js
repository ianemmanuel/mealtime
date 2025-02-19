const subscriptionSchema = new mongoose.Schema({
    restaurantId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Restaurant", 
        required: true 
    },
    name: { 
        type: String, 
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 200 
    },
    description: String, 
    price: { 
        type: Number, 
        required: true, 
        min: 0,
    },
    discount: { 
        type: Number,
        min: 1,
    },
    currency: {
        type: String,
        required: true
    },
    duration: { 
        type: Number, // Number of days per cycle (5-10)
        required: true,
        min: 5,
        max: 10
    },
    cycles: { 
        type: Number, // Number of cycles before expiration
        required: true,
        min: 1 // At least one cycle required
    },
    autoRenew: { 
        type: Boolean, 
        default: false 
    },
    deliveryWindow: { 
        startTime: { type: String, required: true }, // e.g., "18:00"
        endTime: { type: String, required: true }  // e.g., "19:30"
    },
    meals: [
        {
            mealId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: "Meal",
                required: true
            },
            deliveryDate: { 
                type: Date, 
                required: true 
            }
        }
    ],
    isActive: { 
        type: Boolean, 
        default: true 
    }
}, { timestamps: true });

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
