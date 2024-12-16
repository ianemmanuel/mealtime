import Restaurant from "../../models/restaurants/restaurantModel.js"
import  RestaurantProfile from "../../models/restaurants/restaurantProfileModel.js"
import CustomError from "../../middleware/customError.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import expressAsyncHandler from "express-async-handler"
import { nanoid } from 'nanoid';

//* @desc Register a new restaurant
//* @route /api/restaurants/sign-up
//* @access Public

const generateSlug = (email) => {
  const emailPrefix = email.split('@')[0]
  return emailPrefix.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}
export const registerRestaurant = expressAsyncHandler(async (req, res, next) => {
  const {
    name,
    email,
    password,
    phone,
    address,
    taxId,
    legalBusinessName,
    legalBusinessAddress,
    bankName,
    accountNumber,
    accountOwnerFirstName,
    accountOwnerLastName,
  } = req.body

  if (
    !name ||
    !email ||
    !password ||
    !phone ||
    !address ||
    !taxId ||
    !legalBusinessName ||
    !legalBusinessAddress ||
    !bankName ||
    !accountNumber ||
    !accountOwnerFirstName ||
    !accountOwnerLastName
  ) {
    return next(new CustomError("All fields are required", 400))
  }

  //* Check if the restaurant already exists
  const restaurantExists = await Restaurant.findOne({ taxId })
  if (restaurantExists) {
    return next(new CustomError("Restaurant already exists", 400))
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  let slug = await generateSlug(email)

  //* Check if the slug already exists in the Profile collection

  //* Create the restaurant
  const restaurant = await Restaurant.create({
    name,
    email,
    password: hashedPassword,
    phone,
    address,
    taxId,
    legalBusinessName,
    legalBusinessAddress,
    bankName,
    accountNumber,
    accountOwnerFirstName,
    accountOwnerLastName,
  })

  if (restaurant) {
    let slugExists = await RestaurantProfile.findOne({ slug });
    if (slugExists) {
        const uniqueSuffix = String(restaurant._id).slice(-6)
        const randomSuffix = nanoid(5)
        slug = `${slug}${uniqueSuffix}${randomSuffix}`
    }
    //* Create a profile for the restaurant
    await RestaurantProfile.create({
      restaurant: restaurant._id,
      slug
    })

    res.status(201).json({
      _id: restaurant._id,
      name: restaurant.name,
      email: restaurant.email,
      message: "Restaurant registered successfully",
    })
  } else {
    return next(new CustomError("Failed to register, try again later", 400));
  }
})

//* @desc Login a restaurant
//* @route /api/restaurants/login
//* @access Public
export const loginRestaurant = expressAsyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new CustomError("All fields are required", 400));
  }

  //* Find the restaurant
  const restaurant = await Restaurant.findOne({ email });
  if (!restaurant) {
    return next(new CustomError("Invalid email or password", 401));
  }

  //* Compare passwords
  const isMatch = await bcrypt.compare(password, restaurant.password)

  if (isMatch) {
    //* Generate tokens
    const accessToken = jwt.sign(
      { id: restaurant._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    )

    const refreshToken = jwt.sign(
      { id: restaurant._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    )

    //* Save the refresh token in the database
    restaurant.refreshToken = refreshToken
    await restaurant.save()

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(200).json({
      accessToken,
      message: "Logged in successfully",
    })
  } else {
    return next(new CustomError("Invalid email or password", 401))
  }
})
