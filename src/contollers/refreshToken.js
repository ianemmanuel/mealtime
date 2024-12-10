import { Customer } from "../models/customers/customerModel.js"
import CustomError from "../contollers/customError.js"
import jwt from "jsonwebtoken"
import expressAsyncHandler from "express-async-handler"


//* @desc handle refresh token
//* @route /api/customers/sign-up
//* @access public

export const handleRefreshToken = expressAsyncHandler(async(req,res)=>{
    const cookies = req.cookies
    if(!cookies?.jwt) return next(new CustomError("Forbidden", 403))
    
    console.log(cookies.jwt)
    const refreshToken = cookies.jwt

    const foundUser = await Customer.findOne({refreshToken})

    if(!foundUser){
        return next(new CustomError("Forbidden", 403))
    }

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if(err || foundUser._id !== decoded._id){
                return next(new CustomError("Forbidden", 403))
            }
            const accessToken = jwt.sign(
                {"id": decoded._id},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '50s'}
            )
            res.json({ accessToken })
        }
    )

})
