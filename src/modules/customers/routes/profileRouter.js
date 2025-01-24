import express from 'express'
import {
    createProfile,
    getProfile,
    updateProfile,
    deleteProfile,
} from "../controllers/profile.js"
import { verifyJWT } from '../../../middleware/verifyJWT.js'

const customerProfileRouter = express.Router()
//? Profile Routes
customerProfileRouter.route('/')
    .post(verifyJWT,createProfile)

customerProfileRouter.route('/:slug')
    .get(verifyJWT,getProfile)
    .put(verifyJWT,updateProfile)
    .delete(verifyJWT,deleteProfile)

export default customerProfileRouter