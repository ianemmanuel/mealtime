import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  items: [
    {
      meal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meal',
        required: true,
        unique: true,
      },
    },
  ],
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

export default Wishlist;
