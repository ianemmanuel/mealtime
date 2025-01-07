import mongoose from "mongoose"

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Restaurant name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
      trim: true,
    },
    //? Address
    // address: {
    //     street: { type: String, required: true },
    //     city: { type: String, required: true },
    //     state: { type: String },
    //     zipCode: { type: String },
    //     country: { type: String, required: true },
    //   },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    profile: { type: mongoose.Schema.Types.ObjectId, ref: "RestaurantProfile"},
    isVerified: { type: Boolean, default: false},
    refreshToken: { type: String},

    //* Company Details
    taxId: { type: String, required: true, trim: true },
    legalBusinessName: { type: String, required: true, trim: true },
    legalBusinessAddress: { type: String, required: true, trim: true },

    //* Bank Account
    bankName: { type: String, required: true, trim: true },
    accountNumber: { type: String, required: true, trim: true },
    accountOwnerFirstName: { type: String, required: true, trim: true },
    accountOwnerLastName: { type: String, required: true, trim: true },

    createdAt: { type: Date, default: Date.now},
  },
  { timestamps: true }
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant
