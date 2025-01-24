import Wishlist from "../models/wishlistModel.js";
import Meal from "../../meals/models/mealModel.js";
import CustomError from "../../../middleware/customError.js";
import expressAsyncHandler from "express-async-handler";

//* Add a meal to the wishlist
export const addToWishlist = expressAsyncHandler(async (req, res, next) => {
  const userId = req.user

  if (!userId) {
    return next(new CustomError("Not authorized, please log in", 401));
  }

  const { mealId } = req.body

  if (!mealId) {
    return next(new CustomError("Meal ID is required", 400))
  }

  const meal = await Meal.findById(mealId)
  if (!meal) {
    return next(new CustomError("Meal not found", 404))
  }

  if (!meal.isActive || meal.isDeleted){
    return next(
      new CustomError(
        "This meal is no longer available and cannot be added to the wishlist",
        400
      )
    )
  }

  let wishlist = await Wishlist.findOne({ user: userId })
  if (!wishlist) {
    wishlist = new Wishlist({ user: userId, items: [] })
  }

  const exists = wishlist.items.some(
    (item) => item.meal.toString() === mealId
  )
  if (exists) {
    return next(new CustomError("Meal is already in the wishlist", 400))
  }

  wishlist.items.push({ meal: mealId })
  await wishlist.save()

  return res.status(201).json(wishlist)
})

//* Get the current wishlist
export const getWishlist = expressAsyncHandler(async (req, res, next) => {
  const userId = req.user

  if (!userId) {
    return next(new CustomError("Not authorized, please log in", 401))
  }

  const wishlist = await Wishlist.findOne({ user: userId }).populate({
    path: "items.meal",
    match: { isActive: true, isDeleted: false },
  })

  if (!wishlist) {
    return res.status(200).json({ message: "No meal or mealplans present on your wishlist", items: [] })
  }

  return res.status(200).json(wishlist)
})

//* Remove a meal from the wishlist
export const removeFromWishlist = expressAsyncHandler(async (req, res, next) => {
  const userId = req.user

  if (!userId) {
    return next(new CustomError("Not authorized, please log in", 401))
  }

  const { mealId } = req.body

  if (!mealId) {
    return next(new CustomError("The Meal is required", 400))
  }

  const wishlist = await Wishlist.findOne({ user: userId })

  if (!wishlist) {
    return res.status(200).json({
        message: "No meals or mealplans in your wishlist.",
      })
  }

  wishlist.items = wishlist.items.filter(
    (item) => item.meal.toString() !== mealId
  )
  await wishlist.save()

  return res.status(200).json(wishlist);
})
