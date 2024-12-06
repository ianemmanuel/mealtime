import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mealKit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MealKit',
        required: true
    },
    rating:{
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: String,
    restaurantReply: {
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now()
        }
    }

}, {timestamps: true})

reviewSchema.index({user:1, mealKit:1},{unique:true})

export const Review = mongoose.model('Review', reviewSchema);