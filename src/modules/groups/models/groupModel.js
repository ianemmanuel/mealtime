import mongoose from "mongoose"

const groupSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    }, // e.g., "Family Plan"
    subscription: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Subscription", 
            required: true 
        }
    ],
    members: [
        {
            customer: { 
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
    },
    isPublished: { 
        type: Boolean, 
        default: false 
      },
  
      isFeatured: { 
        type: Boolean, 
        default: false 
      },
    isActive: { 
        type: Boolean, 
        default: true 
      }
}, { timestamps: true });

const customerGroup = mongoose.model("customerGroup", groupSchema)

export default customerGroup 
