import express from 'express'
import { registerCustomer } from "../contollers/customer"

const customerRouter = express.Router()

customerRouter.post('/sign-up', registerCustomer)

export default customerRouter