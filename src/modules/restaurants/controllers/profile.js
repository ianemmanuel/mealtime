import RestaurantProfile from "../models/restaurantProfileModel.js"
import Restaurant  from "../models/restaurantModel.js"
import expressAsyncHandler from "express-async-handler"
import CustomError from "../../../middleware/customError.js"
import Category from "../../categories/models/categoryModel.js"
import Meal from "../../meals/models/mealModel.js"

//* @desc Get a restaurant's profile
//* @route GET /api/profiles/:slug
//* @access Private

export const getRestaurantProfile = expressAsyncHandler(async (req, res, next) => {
    const { slug } = req.params

    if (!slug) {
        return next(new CustomError("Restaurant details required", 400))
    }

    const profile = await RestaurantProfile.findOne({ slug }).populate("restaurant", "name email phone")

    if (!profile) {
        return next(new CustomError("Restaurant not found", 404))
    }

    return res.status(200).json(profile)
})

//* @desc Update a restaurant's profile
//* @route PUT /api/profiles/:slug
//* @access Private
export const updateRestaurantProfile = expressAsyncHandler(async (req, res, next) => {
    const { slug } = req.params

    if (!slug) {
        return next(new CustomError("Slug is required to update profile", 400))
    }

    const updates = req.body

    const profile = await RestaurantProfile.findOne({ slug })

    if (!profile) {
        return next(new CustomError("Restaurant not found", 404))
    }
    //! fix this error
    // const restaurant = await Restaurant.findById(profile.restaurant);

    // if (!restaurant) {
    //     return next(new CustomError("Restaurant not found", 404));
    // }

    if (profile.restaurant.toString() !== req.user) {
        return next(new CustomError("Unauthorized to update this profile", 403))
    }

    // Update restaurant profile with the provided fields
    const updatedProfile = await RestaurantProfile.findOneAndUpdate(
        { slug },
        updates,
        {
            new: true,
            runValidators: true,
        }
    )

    return res.status(200).json({
        message: "Profile updated successfully",
        profile: updatedProfile,
    })
})

export const getRestaurantMealsByCategory = async (req, res, next) => {
    try {
      const { restaurantId, categoryId } = req.params
  
      const restaurant = await Restaurant.findOne({
        _id: restaurantId,
        //isActive: true,
        //*isDeleted: false,
      })
  
      if (!restaurant) {
        return next(new CustomError("Restaurant not found bwanaa", 404))
      }
  
      const category = await Category.findOne({
        _id: categoryId,
        restaurant: restaurantId,
        isActive: true,
        publish: true,
      })
      
      if (!category) {
        return next(new CustomError("Category not found for this restaurant", 404))
      }
  
      const meals = await Meal.find({
        restaurant: restaurantId,
        categories: categoryId,
        isActive: true,
        isPublished: true,
      })
        .populate("categories", "name description") // Optional: Populate category details
        .select("-__v -isPublished -isDeleted -isFeatured -isActive")
      
  
      res.status(200).json({
        message: "Meals fetched successfully",
        data: meals,
      })
    } catch (error) {
      console.error(error.message)
      return next(new CustomError("Server error, try again later alaa", 500))
    }
  }