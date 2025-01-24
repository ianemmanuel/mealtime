import mongoose from "mongoose";

//* Schema for individual cart items
const cartItemSchema = new mongoose.Schema(
  {
    meal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meal",
      required: true,
    },
    unit: {
      type: Number,
      default: 1,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },
  },
  { _id: false }
)

//* Schema for the cart
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      unique: true, //* Ensures a user has only one cart
    },
    items: [cartItemSchema], //* Array of cart items
    totalItems: {
      type: Number,
      default: 0, //* Default value to ensure field exists
    },
    totalPrice: {
      type: Number,
      default: 0, //* Default value to ensure field exists
    },
  },
  { timestamps: true }
)

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
