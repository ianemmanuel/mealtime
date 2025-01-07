import mongoose from 'mongoose'



const orderItemsSchema = new mongoose.Schema({
    mealkit:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    }
}, {_id: false});


const cancellationSchema = new mongoose.Schema({
    reason: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
}, {_id: false});


const returnSchema = new mongoose.Schema({
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending','Approved','Denied'],
        default:"Pending",
    },
    date: {
        type: Date,
        default: Date.now()
    },
}, {_id: false})


const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [orderItemsSchema],
    totalPrice: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending','Confirmed','Cancelled', 'Shipped', 'Delivered'],
        default: 'Pending'
    }, 
    address: {
        street:String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
    },
    paymentMethod: {
        type: String,
        enum: ['PayPal', 'Credit Card', 'Google Pay', 'Mpesa'],
        required: true
    },
    cancellation: cancellationSchema,
    return: returnSchema,
}, {timestamps: true})

export const Order = mongoose.model('Order', orderSchema)