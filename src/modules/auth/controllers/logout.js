import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import CustomError from "../../../middleware/customError.js";
import { redis } from "../../../lib/redis.js"

 //* @desc Handle logout for various user types (Customer, Restaurant, User, Admin)
 //* @param {mongoose.Model} model - The Mongoose model to query (e.g., Customer, Restaurant)

export const handleLogout = (model) => expressAsyncHandler(async (req, res) => {
   
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204)

    const refreshToken = cookies.jwt

    const foundUser = await model.findOne({ refreshToken })

    if (!foundUser) {
      res.clearCookie("jwt", { httpOnly: true })
      return res.sendStatus(204)
    }
    
    //* Delete the refresh token from Redis
    await redis.del(`refresh_token:${foundUser._id}`)

    //* Delete the refresh token from the database
    await foundUser.updateOne({ refreshToken: "" })

    res.clearCookie("jwt", { httpOnly: true }) //! Add `secure: true` in production
    res.sendStatus(204) //* No content
  })
