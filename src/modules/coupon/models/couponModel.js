import mongoose from "mongoose"

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    discountType: { 
        type: String, 
        enum: ["percentage", "fixed"], 
        required: true 
    },
    discount: {
        type: Number,
        required: true,
        min: 0
    },
    startDate:{
        type: Date,
        required: true,
        default: Date.now
    },
    endDate:{
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    usageLimit: { 
        type: Number, 
        default: null 
    }, 

},{timestamps: true})

const Coupon = mongoose.model('Category',couponSchema)

export default Coupon