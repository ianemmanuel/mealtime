import mongoose from "mongoose"

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {type: String, trim: true},
    slug: {
        type: String, 
        required: true,
        unique: true,
    },
    isGlobal: {
        type: Boolean,
        default: false, //* Determines if the category is global or restaurant-specific
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    publish: {
        type: Boolean,
        default: true,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: function () {
            return !this.isGlobal //* Restaurant field is required if the category is not global
        },
    },
},{timestamps: true})

const Category = mongoose.model('Category', categorySchema)

export default Category

