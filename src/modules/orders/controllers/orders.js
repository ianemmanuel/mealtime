import Cart from "../../customers/models/cartModel.js";
import expressAsyncHandler from "express-async-handler";
import CustomError from "../../../middleware/customError.js";
import createOrder from "../services/orderService.js"; // Import the orderService

export const createOrders = expressAsyncHandler(async (req, res, next) => {
  const userId = req.user

  if (!userId) {
    return next(new CustomError("Not authorized, please log in", 401))
  }

  const cart = await Cart.findOne({ user: userId }).populate("items.meal")

  if (!cart || cart.items.length === 0) {
    console.log(cart)
    return next(new CustomError("Your cart is empty", 400))
  }

  try {
    const deliveryAddress = req.body.deliveryAddress
    const order = await createOrder(userId, cart, deliveryAddress)

    cart.items = []
    cart.totalItems = 0
    cart.totalPrice = 0
    await cart.save()

    res.status(201).json({
      message: "Order created successfully. Proceed to payment.",
      orderId: order._id,
    })
  } catch (error) {
    console.error("Error during order creation:", error);
    next(new CustomError("Failed to create the order, try again later", 500));
  }
})
