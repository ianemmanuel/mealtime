import express from 'express';
import { registerCustomer, loginCustomer } from "../contollers/customer/customer.js" 
import {
    createProfile,
    getProfile,
    updateProfile,
    deleteProfile,
} from "../contollers/customer/profile.js"
import { verifyJWT } from '../middleware/verifyJWT.js';

const customerRouter = express.Router();

// Customer Authentication Routes
customerRouter.post('/sign-up', registerCustomer)
customerRouter.post('/login', loginCustomer)
customerRouter.get('/logout', loginCustomer)
// Profile Routes
customerRouter.route('/profile')
    .post(verifyJWT,createProfile)

customerRouter.route('/profile/:slug')
    .get(verifyJWT,getProfile)
    .put(verifyJWT,updateProfile)
    .delete(verifyJWT,deleteProfile)

// Get Customer by ID
//?customerRouter.get('/:id', verifyJWT,authorize("admin"),getCustomerById); // Define this route explicitly

export default customerRouter;
