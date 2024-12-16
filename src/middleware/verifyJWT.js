import jwt from "jsonwebtoken"
import CustomError from "./customError.js"
import expressAsyncHandler from "express-async-handler"



export const verifyJWT = expressAsyncHandler( (req, res, next) => {
    const authHeader = req.headers['authorization']
    if (!authHeader) {
        return next(new CustomError("Unauthorized", 401))
    }
    const token = authHeader.split(' ')[1] //?Bearer token
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                return next(new CustomError("Invalid token", 403))
            }
            req.user = decoded.id
            next()
        }
    )
})

export const authorize = (...roles) =>{
    return (req, res, next) =>{
        if(!roles.includes(req.user.role)){
            return next(new CustomError("You don't have the permissions to access this resource", 403))
        }
        next()
    }
}

