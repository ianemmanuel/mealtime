import express from 'express'
import { handleRefreshToken } from "../contollers/refreshToken.js"

 export const refreshTokenRouter = express.Router()


refreshTokenRouter.get('/', handleRefreshToken)


export default refreshTokenRouter