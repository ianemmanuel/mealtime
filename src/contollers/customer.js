import { Customer } from "../models/customerModel"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import expressAsyncHandler from "express-async-handler"



//* @desc Register a new customer
//* @route /api/customers
//* @access public

export const registerCustomer = expressAsyncHandler(async(req, res)=>{
    const { name, email, password } = req.body
    try{
        //*Check if the customer exists
        const customerExists = await Customer.findOne({ email })
        if(customerExists){
             return res.status(400).json({ error: "Email already in use", message: null})
        }

        const hashedPassword = bcrypt.hash(password,10)

        const customer = await Customer.create({
            name,
            email,
            password:hashedPassword
        })

        if(user) {
            res.status(201).json({
                _id: customer._id,
                name: customer.name,
                email: customer.email,
                message: "Signed up successfully"
            })
        } else {
            res.status(400).json({ error: "Failed to sign up, try again later", message: null })
        }
        

    }catch(err){
        console.log(err)
    }
})


