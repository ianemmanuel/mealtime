
import mongoose from "mongoose"

// export const dbConnect = () => 
// mongoose.connect(process.env.MONGODB_URI)
//     .then(()=> console.log("Database connected"))
//     .catch(error=> console.error("MongoDB connection error", error))


export const dbConnect = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Database connected")
    }catch(error){
        console.error("Database connection error", error)
        process.exit(1)
    }
}