import express from "express"
import dotenv from "dotenv"
import { dbConnect } from "./src/utils/utils.js"
import helmet from "helmet"
import morgan from "morgan"
import cors from "cors"
import { errorHandler, notFoundErrorHandler } from "./src/middleware/errorHandler.js"
import customerRouter from "./src/routes/customerRouter.js"
import restaurantRouter from "./src/routes/restaurantRouter.js"
import cookieParser from "cookie-parser"

import {restaurantRefreshTokenRouter, customerRefreshTokenRouter} from "./src/routes/refreshTokenRouter.js"
import { verifyJWT } from './src/middleware/verifyJWT.js'



dotenv.config()

//? connection to mongodb
dbConnect()

const app = express()

//? Middleware setup 
app.use(helmet())
app.use(morgan("dev"))
app.use(express.urlencoded({ extended:false }))
app.use(express.json())
app.use(cors())

//? middleware for cookies
app.use(cookieParser())

//? app.use("/api/refresh", refreshTokenRouter)


//? app.use('/api/customers/refresh-token', customerRefreshTokenRouter)
//? app.use('/api/restaurants/refresh-token', restaurantRefreshTokenRouter)
//? app.use('/api/admins/refresh-token', adminRefreshTokenRouter)

//?app.use("/api/logout", logoutRouter)


//? API routes
app.use("/api/customers", customerRouter)
app.use("/api/restaurants", restaurantRouter)

const PORT = process.env.PORT || 8000
//? Error handler middleware
app.use(notFoundErrorHandler)
app.use(errorHandler);
app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}`)
})