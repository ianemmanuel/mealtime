import express from 'express'
import { registerCustomer, loginCustomer } from "../controllers/customer.js" 

import { customerRefreshTokenRouter } from "../../auth/routes/refreshTokenRouter.js"
import { customerLogoutRouter } from "../../auth/routes/logoutRouter.js"
import { verifyJWT } from '../../../middleware/verifyJWT.js'


const customerRouter = express.Router();

//? Customer Authentication Routes
customerRouter.post('/sign-up', registerCustomer)
customerRouter.post('/login', loginCustomer)
customerRouter.use('/refresh-token', customerRefreshTokenRouter)
customerRouter.use('/logout', customerLogoutRouter)




// Get Customer by ID
//?customerRouter.get('/:id', verifyJWT,authorize("admin"),getCustomerById); // Define this route explicitly

export default customerRouter
