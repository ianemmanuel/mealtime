import express from 'express'
import {
  createMeal,
  updateMeal,
  getMealBySlug,
  getAllMeals,
} from "../controllers/meal.js"
import { verifyJWT } from '../../../middleware/verifyJWT.js'

const mealRouter = express.Router();

//? Meal Routes
mealRouter.route('/')
  .get(getAllMeals) 
  .post(verifyJWT, createMeal)

mealRouter.route('/:slug')
  .get(getMealBySlug) 
  .put(verifyJWT, updateMeal)

export default mealRouter
