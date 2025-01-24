import Restaurant from "../../restaurants/models/restaurantModel.js"
import Meal from "../models/mealModel.js"
import CustomError from "../../../middleware/customError.js"
import Category from "../../categories/models/categoryModel.js"
import slugify from "slugify"
import { nanoid } from "nanoid"
import expressAsyncHandler from "express-async-handler"
import { redis } from "../../../lib/redis.js"

const generateSlug = async (mealName, restaurantId) => {
  const restaurant = await Restaurant.findById(restaurantId)
  
  if (!restaurant) {
    throw new CustomError("Restaurant not found", 404)
  }
  
  const baseSlug = slugify(`${mealName}-${restaurant.name}`, { lower: true })
  let slug = baseSlug
  let suffix = nanoid(6) 

  while (await Meal.exists({ slug, restaurant: restaurantId })) {
    suffix = nanoid(6)
    slug = `${baseSlug}-${suffix}`
  }
  
  return slug
}

//* Create a Meal Controller
export const createMeal = expressAsyncHandler(async (req, res, next) => {
  try{
    const {
      name,
      description,
      price,
      restaurant,
      categories,
      dietaryPreferences,
      nutritionalInfo,
      ingredients,
      images,
      preparationTime,
      tags,
    } = req.body;
  
    if (!name || !price || !restaurant) {
      return new CustomError("Name, price, and restaurant are required fields.", 400)
    }
  
    const restaurantExists = await Restaurant.findById(restaurant)
    if (!restaurantExists) {
      throw new CustomError("The specified restaurant does not exist.", 404)
    }
  
    const existingMeal = await Meal.findOne({ name, restaurant })
    if (existingMeal) {
      throw new CustomError("A meal with this name already exists in the menu of the specified restaurant.", 400)
    }
  
    if (categories && categories.length > 0) {
      const validCategories = await Category.find({ _id: { $in: categories } })
      if (validCategories.length !== categories.length) {
        throw new CustomError("One or more specified categories do not exist.", 400)
      }
    }
  
    const slug = await generateSlug(name, restaurant)
  
    const formattedNutritionalInfo = nutritionalInfo?.map((info) => ({
      name: info.name?.trim(),
      value: info.value?.trim(),
    }))
  
    const formattedIngredients = ingredients?.map((ingredient) =>
      typeof ingredient === "string" ? ingredient.trim() : ""
    )
  
    const formattedTags = tags?.map((tag) =>
      typeof tag === "string" ? tag.trim() : ""
    )
  
    const formattedImages = images?.map((image) => ({
      url: image?.url?.trim(),
      alt: image?.alt?.trim(),
    }))
  
    //* Create and save the meal
    const meal = await Meal.create({
      name,
      slug,
      description,
      price: {
        amount: price.amount,
        currency: price.currency || "USD",
      },
      restaurant,
      categories,
      dietaryPreferences,
      nutritionalInfo: formattedNutritionalInfo,
      ingredients: formattedIngredients,
      images: formattedImages,
      preparationTime: preparationTime || 0,
      tags: formattedTags,
    })
  
    return res.status(201).json({
      success: true,
      message: "Meal created successfully.",
      meal,
    })
  }catch(error){
    console.log(error)
    return new CustomError("Internal server error", 500)
  }

})

export const updateMeal = expressAsyncHandler(async (req, res, next) => {
    const { slug } = req.params
    const {
      name,
      description,
      price,
      categories,
      tags,
      dietaryPreferences,
      ingredients,
      images,
      preparationTime,
      stockLevel,
      isFeatured,
      isActive,
      variants,
      availability,
    } = req.body
  
    const meal = await Meal.findOne({ slug })
  
    if (!meal) {
      return next(new CustomError("Meal not found", 404))
    }
  
    //* Update meal fields
    meal.name = name || meal.name
    meal.slug = slug || meal.slug
    meal.description = description || meal.description
    meal.price = price || meal.price
    meal.categories = categories || meal.categories
    meal.tags = tags || meal.tags
    meal.dietaryPreferences = dietaryPreferences || meal.dietaryPreferences
    meal.ingredients = ingredients || meal.ingredients
    meal.images = images || meal.images
    meal.preparationTime = preparationTime || meal.preparationTime
    meal.stockLevel = stockLevel || meal.stockLevel
    meal.isFeatured = isFeatured !== undefined ? isFeatured : meal.isFeatured
    meal.isActive = isActive !== undefined ? isActive : meal.isActive
    meal.variants = variants || meal.variants
    meal.availability = availability || meal.availability
  
    await meal.save()
  
    return res.status(200).json({
      success: true,
      message: "Meal updated successfully.",
      meal,
    })
})
  
export const getMealBySlug = expressAsyncHandler(async (req, res, next) => {
    const { slug } = req.params

    const meal = await Meal.findOne({ slug }).populate("restaurant").populate("categories")
  
    if (!meal) {
      return next(new CustomError("Meal not found", 404));
    }
  
    return res.status(200).json({
      success: true,
      meal,
    })
})

export const getAllMeals = expressAsyncHandler(async (req, res) => {
    const meals = await Meal.find()
        .populate('categories', 'name') 
        .populate('restaurant', 'name location')
        .sort({ createdAt: -1 })
        
    if (!meals) {
        return next(new CustomError("No meals present at the moment", 404))
    }

    return res.status(200).json({ meals });

})

export const getFeaturedMeals = async(req, res, next) => {
  try {
    let featuredMeals = await redis.get("featured-meals")

    if (featuredMeals) {
      return res.json(JSON.parse(featuredMeals))
    }

    featuredMeals = await Meal.find({isFeatured: true}).lean()

    if (!featuredMeals) {
      return next(new CustomError("No featured meals at the momen", 404))
    }

    await redis.set("featured-meals", JSON.stringify(featuredMeals))
    res.status(200).json(featuredMeals)
  }catch(error){
    console.log(error.messsage)
    return next(new CustomError("Server error, try again later", 500))
  }
}

