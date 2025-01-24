import mongoose from "mongoose"
import OrderItem from "./orderItemModel.js"

const subOrderSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    }, // Reference to the parent order
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    }, // The restaurant fulfilling this sub-order
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem", // References the OrderItem model
      },
    ], // Array of order items for this restaurant
    deliveryFee: { type: Number, default: 0 }, // Delivery fee for this sub-order
    deliveryStatus: {
      type: String,
      enum: [
        "Pending",
        "Preparing",
        "Ready",
        "Out for Delivery",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
    }, // Status of this sub-order
    deliveryAddress: { type: String, required: true }, // Delivery address specific to this sub-order
    deliveryTime: { type: String }, // Delivery time estimate
    subTotalPrice: { type: Number, required: true }, // Total price of the items in this sub-order
    note: {
      type: String,
      maxlength: 500, // Optional field for user instructions, limited to 500 characters
    },
  },
  { timestamps: true }
)

// subOrderSchema.pre('save', async function(next) {
//   try {
//     let total = 0
//     for (const orderItemId of this.items) {
//       const orderItem = await OrderItem.findById(orderItemId).exec()
//       total += orderItem.totalPrice
//     }
//     this.subTotalPrice = total
//     next()
//   } catch (err) {
//     next(err)
//   }
// })

const SubOrder = mongoose.model("SubOrder", subOrderSchema);
export default SubOrder
