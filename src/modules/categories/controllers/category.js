import expressAsyncHandler from "express-async-handler"
import Restaurant from "../../restaurants/models/restaurantModel.js"
import Category  from "../models/categoryModel.js"
import slugify from "slugify"
import CustomError from "../../../middleware/customError.js"
import { nanoid } from "nanoid"

//* Helper function to generate slug
const generateSlug = async (categoryName, restaurantId) => {
  const restaurant = await Restaurant.findById(restaurantId)

  if (!restaurant) {
    throw new CustomError("Restaurant not found", 404)
  }

  const baseSlug = slugify(`${categoryName}-${restaurant.name}`, { lower: true })

  let slug = baseSlug
  let suffix = nanoid(6) 

  while (await Category.exists({ slug, restaurant: restaurantId })) {
    suffix = nanoid(6)
    slug = `${baseSlug}-${suffix}` 
  }
  return slug
}

//* @desc    Create a new category
//* @route   POST /api/categories
//*@access  Private (Admin or Restaurant Owner based on isGlobal)

export const createCategory = expressAsyncHandler(async (req, res, next) => {
  const { name, description, restaurant } = req.body

  if (!name || !restaurant){
    return next(new CustomError("Category name and restaurant are required for non-global categories", 400))
  }

  const slug = await generateSlug(name, restaurant)

  const category = new Category({
    name,
    description,
    slug,
    restaurant,
  })

  await category.save();

  return res.status(201).json({
    success: true,
    message: "Category created successfully.",
    category,
  })
})

//* @desc    Update an existing category
//* @route   PUT /api/categories/:slug
//* @access  Private (Admin or Restaurant Owner)
export const updateCategory = expressAsyncHandler(async (req, res, next) => {
  const { slug } = req.params
  const {
    name,
    description,
    isGlobal,
    isActive,
    publish,
    isFeatured,
    restaurant,
  } = req.body;

  // Find the category by slug
  const category = await Category.findOne({ slug })

  if (!category) {
    return next(new CustomError("Category not found", 404));
  }

  //! Check if the user is authorized to update the category
  // if (category.isGlobal === false && category.restaurant.toString() !== req.user.restaurant.toString()) {
  //   return next(new CustomError("Unauthorized action", 403));
  // }

  category.name = name || category.name
  category.description = description || category.description
  category.isGlobal = isGlobal !== undefined ? isGlobal : category.isGlobal
  category.isActive = isActive !== undefined ? isActive : category.isActive
  category.publish = publish !== undefined ? publish : category.publish
  category.isFeatured = isFeatured !== undefined ? isFeatured : category.isFeatured
  category.restaurant = restaurant || category.restaurant

  //* Save updated category
  await category.save()

  return res.status(200).json({
    success: true,
    message: "Category updated successfully.",
    category,
  })
})

//* @desc Get all categories
//* @route GET /api/categories
//* @access Public
export const getAllCategories = expressAsyncHandler(async (req, res) => {
  const categories = await Category.find().populate('restaurant');

  if (!categories || categories.length === 0) {
    return next(new CustomError("No categories found.", 404));
  }

  return res.status(200).json({
    success: true,
    categories,
  })
})

//* @desc  Get category by slug
//* @route  GET /api/categories/:slug
//* @access  Public
export const getCategoryBySlug = expressAsyncHandler(async (req, res, next) => {
  const { slug } = req.params;

  const category = await Category.findOne({ slug }).populate('restaurant');

  if (!category) {
    return next(new CustomError("Category not found", 404));
  }

  return res.status(200).json({
    success: true,
    category,
  })
})


//! DEAL WITH THIS LATER
//* @desc    Delete a category
//* @route   DELETE /api/categories/:slug
//* @access  Private (Admin or Restaurant Owner)
export const deleteCategory = expressAsyncHandler(async (req, res, next) => {
  const { slug } = req.params;

  const category = await Category.findOne({ slug });

  if (!category) {
    return next(new CustomError("Category not found", 404));
  }

  // Check if the user is authorized to delete the category
  if (category.isGlobal === false && category.restaurant.toString() !== req.user.restaurant.toString()) {
    return next(new CustomError("Unauthorized action", 403));
  }

  // Delete category
  await category.remove()

  return res.status(200).json({
    success: true,
    message: "Category deleted successfully.",
  })
});
