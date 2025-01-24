import mongoose from "mongoose"
import SubOrder from "./subOrderModel.js"

const OrderSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    subOrders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubOrder",
      },
    ], 
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    totalPrice: { type: Number, required: true }, //* Cumulative price of all sub-orders
    stripeSessionId : {
      type: String,
      unique: true
    }
  },
  { timestamps: true }
)


const Order = mongoose.model("Order", OrderSchema);
export default Order;
