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
    paymentMethod: {
        type: String,
        required: true,
        trim: true
    },
    startDate: { 
        type: Date, 
        required: true 
    },
    endDate: { 
        type: Date, 
        required: true 
    },
    currentCycle: { 
        type: Number, 
        default: 1 
    },
    status: { 
        type: String, 
        enum: ["active", "paused", "cancelled", "expired"], 
        default: "active" 
    }
}, { timestamps: true });

export const CustomerSubscription = mongoose.model("CustomerSubscription", customerSubscriptionSchema);
