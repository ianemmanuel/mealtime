import MealPlan from "../models/mealPlanModel.js"
import Restaurant from "../../restaurants/models/restaurantModel.js"
import CustomError from "../../../middleware/customError.js"
import Meal from "../../meals/models/mealModel.js"
import { nanoid } from "nanoid"
import expressAsyncHandler from "express-async-handler"
import  Category  from "../../categories/models/categoryModel.js"
import slugify from "slugify"

const generateSlug = async (mealPlanName, restaurantId) => {
  const restaurant = await Restaurant.findById(restaurantId)
  
  if (!restaurant) {
    return new CustomError("Restaurant not found", 404)
  }
  
  const baseSlug = slugify(`${mealPlanName}-${restaurant.name}`, { lower: true })
  let slug = baseSlug
  let suffix = nanoid(6) 

  while (await MealPlan.exists({ slug, restaurant: restaurantId })) {
    suffix = nanoid(6)
    slug = `${baseSlug}-${suffix}`
  }
  
  return slug
}



//* Get all meal plans


export const getMealPlanBySlug = expressAsyncHandler(async (req, res, next) => {
  const { slug } = req.params;

  if (!slug) {
    return next(new CustomError("Slug parameter is required.", 400));
  }

  // Fetch the meal plan by slug
  const mealPlan = await MealPlan.findOne({ slug, isDeleted: false })
    .populate({
      path: "restaurant",
      select: "name slug _id",
    })
    .populate({
      path: "categories",
      select: "name slug _id",
    })
    .populate({
      path: "meals",
      select: "name categories description slug price ratings",
      populate: [
        {
          path: "categories",
          select: "name slug _id",
        },
        {
          path: "price",
          select: "amount currency",
        },
        {
          path: "ratings",
          select: "averageRating",
        },
      ],
    })


  if (!mealPlan) {
    return next(new CustomError("Meal plan not found.", 404))
  }

  return res.status(200).json({
    success: true,
    message: "Meal plan fetched successfully.",
    mealPlan,
  })
})

//* create a new meal plan
export const createMealPlan = expressAsyncHandler(async (req, res, next) => {
  const {
    name,
    description,
    price,
    discount,
    restaurant,
    meals,
    categories,
    images,
    tags,
    startDate, 
    endDate
  } = req.body;

  // Validate required fields
  if (!name || !price?.amount || !restaurant || !meals || !Array.isArray(meals) || meals.length === 0) {
    return next(new CustomError("Name, price, restaurant, and meals are required fields.", 400))
  }

  // Check if the restaurant exists
  const restaurantExists = await Restaurant.findById(restaurant);
  if (!restaurantExists) {
    return next(new CustomError("The specified restaurant does not exist.", 404));
  }

  // Check for existing meal plan with the same name in the restaurant
  const existingMealPlan = await MealPlan.findOne({ name, restaurant });
  if (existingMealPlan) {
    return next(new CustomError("A meal plan with this name already exists in your menu.", 400));
  }

  // Validate that all specified meals exist and belong to the specified restaurant
  const validMeals = await Meal.find({ _id: { $in: meals }, restaurant });
  if (validMeals.length !== meals.length) {
    return next(new CustomError("One or more specified meals do not exist or do not belong to the specified restaurant.", 400));
  }

  // Validate categories if provided
  if (categories && categories.length > 0) {
    const validCategories = await Category.find({ _id: { $in: categories } });
    if (validCategories.length !== categories.length) {
      return next(new CustomError("One or more specified categories do not exist.", 400));
    }
  }

  // Generate a unique slug for the meal plan
  const slug = await generateSlug(name, restaurant);

  // Format optional fields
  const formattedTags = tags?.map((tag) => (typeof tag === "string" ? tag.trim() : ""));
  const formattedImages = images?.map((image) => ({
    url: image?.url && typeof image.url === "string" ? image.url.trim() : "",
  }));

  // Create the meal plan
  const mealPlan = await MealPlan.create({
    name,
    slug,
    description,
    price: {
      amount: price.amount,
      currency: price.currency || "USD",
    },
    restaurant,
    meals,
    discount,
    categories,
    images: formattedImages,
    tags: formattedTags,
    startDate, 
    endDate
  })

  return res.status(201).json({
    success: true,
    message: "Meal plan created successfully.",
    mealPlan,
  })
})
//* Update an existing meal plan by slug
export const updateMealPlan = expressAsyncHandler(async (req, res, next) => {
  const { slug } = req.params
  const {     
    name,
    description,
    price,
    discount,
    restaurant,
    meals,
    categories,
    images,
    tags,
    isDeleted,
    isFeatured,
    isPublic,
    isPublished,
    status,
    startDate, 
    endDate } = req.body

  // Find the meal plan by slug
  const mealPlan = await MealPlan.findOne({ slug, restaurant, isDeleted: false });

  if (!mealPlan) {
    return next(new CustomError("The Meal plan is not found in your menu", 404))
  }

  mealPlan.name = name || mealPlan.name
  mealPlan.description = description || mealPlan.description
  mealPlan.price = price || mealPlan.price
  mealPlan.discount = discount || mealPlan.discount
  mealPlan.meals = meals || mealPlan.meals
  mealPlan.categories = categories || mealPlan.categories
  mealPlan.tags = tags || mealPlan.tags
  mealPlan.images = images || mealPlan.images
  mealPlan.isDeleted = isDeleted !== undefined ? isDeleted : mealPlan.isDeleted
  mealPlan.isFeatured = isFeatured  !== undefined ? isFeatured  : mealPlan.isFeatured 
  mealPlan.isPublic = isPublic !== undefined ? isPublic : mealPlan.isPublic
  mealPlan.isPublished = isPublished !== undefined ? isPublished : mealPlan.isPublished
  mealPlan.status = status || mealPlan.status
  mealPlan.startDate = startDate || mealPlan.startDate
  mealPlan.endDate = endDate || mealPlan.endDate

  await mealPlan.save()

  return res.status(200).json({
     success: true, 
     message: "Meal plan updated successfully",
     mealPlan 
  })
})

export const getAllMealPlans = expressAsyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, sort = 'createdAt', order = 'desc', search, tags, categories } = req.query

  try {
    //* Build query filters
    const filters = { isDeleted: false };

    if (search) {
      filters.name = { $regex: search, $options: 'i' }; //* Case-insensitive search
    }

    if (tags) {
      filters.tags = { $in: tags.split(',') }; //* Match any of the specified tags
    }

    if (categories) {
      filters.categories = { $in: categories.split(',') }; //* Match any of the specified categories
    }

    //* Pagination settings
    const skip = (page - 1) * limit;

    //* Sorting settings
    const sortOptions = { [sort]: order === 'desc' ? -1 : 1 };

    //* Fetch meal plans
    const mealPlans = await MealPlan.find(filters)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit))
      .populate('restaurant', 'name slug')
      .populate('meals', 'name price slug') 
      .populate('categories', 'name slug') 
      .select('-status -isPublic -isPublished -isFeatured -isDeleted -slug')

    // Count total meal plans
    const totalMealPlans = await MealPlan.countDocuments(filters);

    return res.status(200).json({
      success: true,
      message: 'Meal plans fetched successfully.',
      data: {
        total: totalMealPlans,
        page: Number(page),
        limit: Number(limit),
        mealPlans,
      },
    });
  } catch (error) {
    return next(new CustomError('An error occurred while fetching meal plans.', 500));
  }
})

