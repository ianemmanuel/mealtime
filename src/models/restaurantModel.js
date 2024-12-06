import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    plan:{
        type:String,
        enum:["basic", "premium"],
        required: true,
    },
    srartDate: {
        type: Date,
        required: true
    },
    endDate:{
        type: Date,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true
    },
},{_id:false})

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    descripton: {
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    mealkits:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MealKit'
    }],
    subScription: subscriptionSchema,   
},{timestamps: true});


export const Restaurant = mongoose.model('Restaurant', restaurantSchema);