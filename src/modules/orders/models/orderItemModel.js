import mongoose from "mongoose"

const orderItemSchema = new mongoose.Schema(
    {
      subOrder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubOrder",
        required: true,
      }, // Reference to the sub-order
      meal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Meal",
        required: true,
      }, // The meal being ordered
      quantity: { type: Number, required: true }, // Number of units ordered
      pricePerUnit: { type: Number, required: true }, // Price of a single unit
      totalPrice: { type: Number, required: true }, // Total price for this item (pricePerUnit * quantity)
    },
    { timestamps: true }
  );
  
  const OrderItem = mongoose.model("OrderItem", orderItemSchema);
  export default OrderItem;
  