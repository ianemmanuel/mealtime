import express from 'express';
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from '../controllers/wishlist.js'
import { verifyJWT } from '../../../middleware/verifyJWT.js'

const wishlistRouter = express.Router()

wishlistRouter.route('/')
  .post(verifyJWT, addToWishlist) //* Add a meal to the wishlist
  .get(verifyJWT, getWishlist) //* Get the wishlist
  .delete(verifyJWT, removeFromWishlist) //* Remove a meal from the wishlist

export default wishlistRouter
