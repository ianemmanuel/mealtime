import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
} from "../controllers/cart.js";
import { verifyJWT } from "../../../middleware/verifyJWT.js";

const cartRouter = express.Router()

cartRouter
  .route("/")
  .post(verifyJWT, addToCart) 
  .get(verifyJWT, getCart) 
  .delete(verifyJWT, clearCart)

cartRouter
  .route("/remove")
  .post(verifyJWT, removeFromCart)

export default cartRouter;
