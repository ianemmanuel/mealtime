import { Customer } from "../models/customerModel.js"
import { redis } from "../../../lib/redis.js"
import CustomError from "../../../middleware/customError.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import expressAsyncHandler from "express-async-handler"




export const registerCustomer = expressAsyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body

    if(!name || !email || !password){
        return next(new CustomError("All fields are required", 400))
    }

    //* Check if the customer exists
    const customerExists = await Customer.findOne({ email })
    if (customerExists) {
        return next(new CustomError("Email already in use", 400))
    }

    const hashedPassword = await bcrypt.hash(password,10)

    const customer = await Customer.create({
        name,
        email,
        password: hashedPassword,
    })

    if (customer) {
        res.status(201).json({
            id: customer._id,
            name: customer.name,
            email: customer.email,
            message: "Signed up successfully",
        })
    } else {
        return next(new CustomError("Failed to sign up, try again later", 400))
    }
})

export const loginCustomer = expressAsyncHandler(async (req, res, next) => {
    const { email, password } = req.body

    if(!email || !password) {
        return next(new CustomError("All fields are required", 400))
    }

    const customer = await Customer.findOne({email})
    
    if(!customer) {
        return next(new CustomError("Invalid email or password", 401))
    }
    const match = await bcrypt.compare(password, customer.password)

    if(!match){
        return next(new CustomError("Invalid email or password", 401))
    }
        //* access and refreshToken
    const accessToken = jwt.sign(
        {id: customer._id}, 
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d'}
    )
    const refreshToken = jwt.sign(
        {id: customer._id}, 
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d'}
    )

    //* Store the refresh token in Redis
    await redis.setex(`refresh_token:${customer._id}`,7*24*60*60, refreshToken)

    //* save the refresh token 
    customer.refreshToken = refreshToken
    await customer.save()

    res.cookie('jwt', refreshToken, 
        {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        }
    )
    res.status(200).json({
        accessToken,
        message: "Logged in successfully"
    })
 
})



