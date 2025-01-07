import express from "express"
import {
  createMealPlan,
  updateMealPlan,
  getMealPlanBySlug,
  getAllMealPlans,
} from "../controllers/mealPlan.js"
import { verifyJWT } from "../../../middleware/verifyJWT.js"

const mealPlanRouter = express.Router();

//? Meal Plan Routes
mealPlanRouter.route("/")
  .get(getAllMealPlans)
  .post(verifyJWT, createMealPlan)

mealPlanRouter.route("/:slug")
  .get(getMealPlanBySlug)
  .put(verifyJWT, updateMealPlan)

export default mealPlanRouter
