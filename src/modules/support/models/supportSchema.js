import mongoose from 'mongoose';


const messageSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
}, {_id: false})

const supportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mealkit:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mealkit',
        required: true
    },
    subject:{
        type: String,
        required: true
    },
    message: [messageSchema],
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'closed'],
        default: 'open',
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low',
    },
    category: String,
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    updatedAt:{
        type: Date,
        default: Date.now()
    } 
}, {timestamps: true});

supportSchema.pre('save', function (next){
    this.updatedAt = new Date()
    next()
})

export const Support = mongoose.model('Support', supportSchema);

