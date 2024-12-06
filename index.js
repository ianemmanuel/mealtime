import express from "express"
import dotenv from "dotenv"
import { dbConnect } from "./src/utils/utils.js"
import helmet from "helmet"
import morgan from "morgan"
import cors from "cors"
import { errorHandler, notFoundErrorHandler } from "./src/middleware/errorHandler.js"
import customerRouter from "./src/routes/customerRouter.js"

dotenv.config()

//* connection to mongodb
dbConnect()

const app = express()

//* Middleware setup 
app.use(helmet())
app.use(morgan("dev"))
app.use(express.json())
app.use(cors())


//* API routes
app.use("/api/customer", customerRouter)


//* Error handler middleware
app.use(errorHandler)
app.use(notFoundErrorHandler)


const PORT = process.env.PORT || 8000

app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}`)
})