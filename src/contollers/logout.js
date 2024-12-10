import { Customer } from "../models/customers/customerModel.js"
import CustomError from "./customError.js"
import jwt from "jsonwebtoken"
import expressAsyncHandler from "express-async-handler"


//* @desc handle refresh token
//* @route /api/customers/sign-up
//* @access public

export const handleLogout = expressAsyncHandler(async(req,res)=>{
    //! On client also delete the accessToken

    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(204) //* No content
    
    const refreshToken = cookies.jwt

    const foundUser = await Customer.findOne({refreshToken})

    if(!foundUser){
        res.clearCookie('jwt', { httpOnly: true })
        return res.sendStatus(204)
    }

    //* Delete refreshToken from db
    await foundUser.updateOne({refreshToken:''})

    res.clearCookie('jwt', { httpOnly: true }) //! add secure : true when in production
    res.sendStatus(204) //* No content
 

})
