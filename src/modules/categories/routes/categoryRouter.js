import express from 'express'
import {
  createCategory,
  getAllCategories,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
} from "../controllers/category.js"
import { verifyJWT } from '../../../middleware/verifyJWT.js'

const categoryRouter = express.Router();

//? Category Routes
categoryRouter.route('/')
  .get(getAllCategories)
  .post(verifyJWT, createCategory)

categoryRouter.route('/:slug')
  .get(getCategoryBySlug)
  .put(verifyJWT, updateCategory)
  .delete(verifyJWT, deleteCategory) 

export default categoryRouter
