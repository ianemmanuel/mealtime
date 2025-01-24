import express from "express";
import { createOrders } from "../controllers/orders.js"

import { verifyJWT } from '../../../middleware/verifyJWT.js'
const orderRouter = express.Router();

orderRouter.post("/create", verifyJWT, createOrders);

export default orderRouter;
