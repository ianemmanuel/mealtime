import express from 'express'
import {
    createProfile,
    getProfile,
    updateProfile,
    deleteProfile,
} from "../controllers/customerProfile"

const customerProfileRouter = express.Router()
//? Profile Routes
customerProfileRouter.route('/profile')
    .post(verifyJWT,createProfile)

customerProfileRouter.route('/profile/:slug')
    .get(verifyJWT,getProfile)
    .put(verifyJWT,updateProfile)
    .delete(verifyJWT,deleteProfile)

export default customerProfileRouter