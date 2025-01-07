import mongoose from 'mongoose'

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mealkits: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MealKit',
    }
  ]  
})

export const Wishlist = new  mongoose.model('Wishlist', wishlistSchema)