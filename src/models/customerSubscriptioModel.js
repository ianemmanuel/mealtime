const customerSubscriptionSchema = new mongoose.Schema({
    customerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Customer", 
        required: true 
    },
    subscriptionId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Subscription", 
        required: true 
    },
    startDate: { 
        type: Date, 
        required: true 
    },
    endDate: { 
        type: Date, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ["active", "paused", "cancelled"], 
        default: "active" 
    },
    deliverySchedule: [String], // e.g., ["Monday", "Wednesday", "Friday"]
}, { timestamps: true });

export const CustomerSubscription = mongoose.model("CustomerSubscription", customerSubscriptionSchema);
