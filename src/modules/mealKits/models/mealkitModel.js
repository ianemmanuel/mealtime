import mongoose from 'mongoose'


const mealKitVariationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    }, 
    price:{
        type: Number,
        required: true,
        min: 0
    }
});




const mealkitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    restaurant:{
        type: mongoose.Schema.ObjectId,
        ref:"Restaurant",
        required: true
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref:"Category",
        required: true
    },
    image:[String],
    variations: [mealKitVariationSchema],
    ratingAverage: {
        type: Number,
        default: 0
    },
    ratingQuantity: {
        type: Number,
        default: 0
    }, 
    reviews: {
        type: mongoose.Schema.ObjectId,
        ref:"Review", 
    }
},{ timestamps: true})

export const Mealkit = mongoose.model("Mealkit",mealkitSchema)

