import mongoose from "mongoose"
import Order from "../models/orderModel.js"
import SubOrder from "../models/subOrderModel.js"
import OrderItem from "../models/orderItemModel.js"
import Meal from "../../meals/models/mealModel.js"
import CustomError from "../../../middleware/customError.js"

const createOrder = async (userId, cart, deliveryAddress) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!cart || cart.items.length === 0) {
      throw new CustomError("Your cart is empty", 400);
    }

    if (!deliveryAddress || typeof deliveryAddress !== "string") {
      throw new CustomError("Invalid delivery address.", 400);
    }

    // Validate and Sync Cart Items
    const itemIds = cart.items.map((item) => item.meal._id);
    const mealsMap = new Map();

    const availableMeals = await Meal.find({
      _id: { $in: itemIds },
      isDeleted: false,
      isActive: true,
      status: "available",
    })
      .session(session)
      .lean();

    availableMeals.forEach((meal) => mealsMap.set(meal._id.toString(), meal));

    const updatedCartItems = cart.items.map((cartItem) => {
      const meal = mealsMap.get(cartItem.meal._id.toString());
      if (!meal) {
        throw new CustomError(`Meal with ID ${cartItem.meal._id} is unavailable.`, 400);
      }

      if (!meal.price || !meal.price.amount) {
        throw new CustomError(`Invalid price for "${meal.name}".`, 400);
      }

      if (cartItem.meal.price.amount !== meal.price.amount) {
        throw new CustomError(`Price for "${meal.name}" has changed.`, 400);
      }

      cartItem.meal.name = meal.name;
      cartItem.meal.price.amount = meal.price.amount;

      return cartItem;
    });

    // Group Items by Restaurant
    const restaurantOrders = updatedCartItems.reduce((result, item) => {
      const restaurantId = item.meal.restaurant.toString();
      if (!result[restaurantId]) {
        result[restaurantId] = { restaurant: restaurantId, items: [], deliveryAddress };
      }
      result[restaurantId].items.push({
        meal: item.meal._id,
        quantity: item.unit,
        pricePerUnit: item.meal.price.amount,
        totalPrice: item.meal.price.amount * item.unit,
      });
      return result;
    }, {});

    // Create Parent Order
    const order = new Order({
      customer: userId,
      paymentStatus: "Pending",
      subOrders: [],
      totalPrice: 0,
    });
    await order.save({ session });

    // Create SubOrders and Items
    for (const [restaurantId, subOrderData] of Object.entries(restaurantOrders)) {
      const subOrder = new SubOrder({
        order: order._id,
        restaurant: restaurantId,
        items: [],
        deliveryAddress: subOrderData.deliveryAddress,
        subTotalPrice: 0,
      });
      await subOrder.save({ session });

      const orderItems = subOrderData.items.map((item) => ({
        ...item,
        subOrder: subOrder._id,
      }));

      const savedItems = await OrderItem.insertMany(orderItems, { session });
      subOrder.items = savedItems.map((item) => item._id);
      subOrder.subTotalPrice = savedItems.reduce((sum, item) => sum + item.totalPrice, 0);
      await subOrder.save({ session });

      console.log(subOrder.subTotalPrice)

      order.totalPrice = subOrder.subTotalPrice;

      order.subOrders.push(subOrder._id);
    }

    // Calculate Total Price
    
    await order.save({ session });

    await session.commitTransaction();
    return order;
  } catch (error) {
    console.error("Error during order creation:", error);
    await session.abortTransaction();
    throw new CustomError(error.message, error.status || 500);
  } finally {
    session.endSession();
  }
};


export default createOrder

