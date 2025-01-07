import express from 'express';
import { registerRestaurant, loginRestaurant } from "../controllers/restaurant.js" 
import {
    getRestaurantProfile,
    updateRestaurantProfile,
} from "../controllers/profile.js"
import { restaurantRefreshTokenRouter } from "../../auth/routes/refreshTokenRouter.js"
import { verifyJWT } from '../../../middleware/verifyJWT.js'
import { restaurantLogoutRouter } from "../../auth/routes/logoutRouter.js"
const restaurantRouter = express.Router();

//* Authentication Routes
restaurantRouter.post('/register', registerRestaurant)
restaurantRouter.post('/login', loginRestaurant)
restaurantRouter.use('/refresh-token', restaurantRefreshTokenRouter)
restaurantRouter.use('/logout', restaurantLogoutRouter) 


//? restaurantRouter.route('/profile')
//?     .post(verifyJWT,createProfile)

restaurantRouter.route('/profile/:slug')
    .get(getRestaurantProfile)
    .put(verifyJWT,updateRestaurantProfile)
    //?.delete(verifyJWT,deleteProfile)

// Get Customer by ID
//?restaurantRouter.get('/:id', verifyJWT,authorize("admin"),getCustomerById); // Define this route explicitly

export default restaurantRouter
