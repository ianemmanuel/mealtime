import express from 'express'
import {handleLogout} from '../contollers/logout.js'

export const logoutRouter = (model) => {
  const router = express.Router()
  router.get('/', handleLogout(model))
  return router
}
