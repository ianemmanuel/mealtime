import express from 'express';
import { registerCustomer, loginCustomer } from "../contollers/customer/customer.js" 
import {
    createProfile,
    getProfile,
    updateProfile,
    deleteProfile,
} from "../contollers/customer/profile.js"
import { customerRefreshTokenRouter } from "./refreshTokenRouter.js"
import { customerLogoutRouter } from "./logoutRouter.js"
import { verifyJWT } from '../middleware/verifyJWT.js'


const customerRouter = express.Router();

//? Customer Authentication Routes
customerRouter.post('/sign-up', registerCustomer)
customerRouter.post('/login', loginCustomer)
customerRouter.use('/refresh-token', customerRefreshTokenRouter)
customerRouter.use('/logout', customerLogoutRouter)


//? Profile Routes
customerRouter.route('/profile')
    .post(verifyJWT,createProfile)

customerRouter.route('/profile/:slug')
    .get(verifyJWT,getProfile)
    .put(verifyJWT,updateProfile)
    .delete(verifyJWT,deleteProfile)

// Get Customer by ID
//?customerRouter.get('/:id', verifyJWT,authorize("admin"),getCustomerById); // Define this route explicitly

export default customerRouter
