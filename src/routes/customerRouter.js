import express from 'express'
import { registerCustomer } from "../contollers/customer.js"

const customerRouter = express.Router()

customerRouter.post('/sign-up', registerCustomer)

export default customerRouter