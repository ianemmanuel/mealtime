import express from 'express'
import handleRefreshToken from '../contollers/refreshToken.js'

export const createRefreshTokenRouter = (Model) => {
  const router = express.Router()
  router.get('/', handleRefreshToken(Model))
  return router
}
