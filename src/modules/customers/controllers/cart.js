import Cart from "../models/cartModel.js"
import Meal from "../../meals/models/mealModel.js"
import CustomError from "../../../middleware/customError.js"
import expressAsyncHandler from "express-async-handler"

//* Add or update an item in the cart
export const addToCart = expressAsyncHandler(async (req, res, next) => {
  const userId = req.user

  if (!userId) {
    return next(new CustomError("Not authorized, please log in", 401))
  }

  const { mealId, unit } = req.body

  if (!mealId || unit < 1) {
    return next(new CustomError("Invalid input: The meal and unit must be provided", 400))
  }

  const meal = await Meal.findById(mealId)
  if (!meal) {
    return next(new CustomError("Meal not found", 404))
  }

  let cart = await Cart.findOne({ user: userId })
  if (!cart) {
    cart = new Cart({ user: userId, items: [] })
  }

  const existingItemIndex = cart.items.findIndex((item) => item.meal.toString() === mealId)

  if (existingItemIndex >= 0) {
    cart.items[existingItemIndex].unit += unit //* Increment the unit for existing items
  } else {
    cart.items.push({ meal: mealId, unit }) //* Add new meal to the cart
  }
  try {
    //* Calculate totals
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.unit, 0)
    cart.totalPrice = await calculateTotalPrice(cart.items)

    await cart.save()
    res.status(200).json(cart)

    } catch (error) {
    console.error("Error during cart save operation:", error.message)
    console.log(cart.items.meal)
    next(new CustomError("Failed to save the cart", 500))
  }
})

//* Get the current cart

export const getCart = expressAsyncHandler(async (req, res, next) => {
  const userId = req.user

  if (!userId) {
    return next(new CustomError("Not authorized, please log in", 401))

  }

  const cart = await Cart.findOne({ user: userId }).populate("items.meal")

  if (!cart) {
    return res.status(200).json({ message:"No items present in your cart",items: [], totalItems: 0, totalPrice: 0 })
  }

  return res.status(200).json(cart)
})

//* Remove an item or decrement its unit in the cart
export const removeFromCart = expressAsyncHandler(async (req, res, next) => {
  const userId = req.user

  if (!userId) {
    return next(new CustomError("Not authorized, please log in", 401))
  }

  const { mealId, unit } = req.body

  if (!mealId || unit < 1) {

    return next(new CustomError("Invalid input: The meal and unit must be provided", 400))
  }

  const cart = await Cart.findOne({ user: userId })

  if (!cart) {
    return next(new CustomError(" Your cart is already empty", 404))

  }

  const itemIndex = cart.items.findIndex((item) => item.meal.toString() === mealId)

  if (itemIndex < 0) {
    return next(new CustomError(" Item not found in cart", 404))
  }

  if (cart.items[itemIndex].unit > unit) {
    cart.items[itemIndex].unit -= unit //* Decrement the unit
  } else {
    cart.items.splice(itemIndex, 1)
  }

  //* Calculate totals
  cart.totalItems = cart.items.reduce((sum, item) => sum + item.unit, 0)
  cart.totalPrice = await calculateTotalPrice(cart.items)

  await cart.save()
  return res.status(200).json(cart)
})

//* Clear the entire cart
export const clearCart = expressAsyncHandler(async (req, res, next) => {
  const userId = req.user

  if (!userId) {
    return next(new CustomError("Not authorized, please log in", 401))
  }

  const cart = await Cart.findOne({ user: userId })
  if (!cart) {
    return next(new CustomError("Your cart is already empty", 401))

  }

  cart.items = []
  cart.totalItems = 0
  cart.totalPrice = 0

  await cart.save()
  return res.status(200).json(cart)

})

//* Utility function to calculate total price
const calculateTotalPrice = async (items) => {
  let totalPrice = 0
  for (const item of items) {
    const meal = await Meal.findById(item.meal)
    if (meal) {
      totalPrice += meal.price.amount * item.unit
    }
  }
  return totalPrice
}
