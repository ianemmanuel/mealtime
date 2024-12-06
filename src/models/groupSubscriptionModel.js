const groupSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    }, // e.g., "Family Plan"
    subscriptionId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Subscription", 
        required: true 
    },
    members: [
        {
            customerId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: "Customer" 
            },
            role: { 
                type: String, 
                enum: ["admin", "member"], 
                default: "member" 
            }
        }
    ], // Group members with roles
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Customer", 
        required: true 
    }, // Group creator
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
    }
}, { timestamps: true });

export const Group = mongoose.model("Group", groupSchema);
