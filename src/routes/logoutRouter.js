import express from 'express'
import { handleLogout } from "../contollers/logout.js"

const logoutRouter = express.Router()


logoutRouter.get('/',handleLogout)

export default logoutRouter;
