import { Profile } from "../../models/customers/profileModel.js"
import { Customer } from "../../models/customers/customerModel.js"
import expressAsyncHandler from "express-async-handler"
import CustomError from "../customError.js"

//* @desc Create a new profile for a customer
//* @route POST /api/profile
//* @access Private


const generateSlug = (email) => {
    const emailPrefix = email.split('@')[0]
    return emailPrefix.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

export const createProfile = expressAsyncHandler(async (req, res, next) => {
    const { customerId, bio, socialLinks } = req.body;

    const customer = await Customer.findById(customerId);
    if (!customer) {
        return next(new CustomError("Customer not found", 404))
    }

    //?const existingProfile = await Profile.findOne({ customer: customerId });
    if (customer.profile) {
        return next(new CustomError("Profile already exists for this customer", 400))
    }

    const slug = await generateSlug(customer.email)

    //* Check if the slug already exists in the Profile collection
    let slugExists = await Profile.findOne({ slug });
    if (slugExists) {
        const uniqueSuffix = customerId.slice(-6)
        const randomSuffix = nanoid(5)
        slug = `${slug}${uniqueSuffix}${randomSuffix}`
    }

    const profile = await Profile.create({
        customerId,
        bio,
        socialLinks,
        slug,
    })

    customer.profile = profile._id;
    await customer.save()

    return res.status(201).json({
        message: "Profile created successfully",
        profile,
    });
});

/*
 * @desc Get a user's profile
 * @route GET /api/profiles/:customerId
 * @access Private
 */
export const getProfile = expressAsyncHandler(async (req, res, next) => {
    const { slug } = req.params
    if (!slug) {
        return next(new CustomError("Customer details required", 400))
    }

    const profile = await Profile.findOne({ slug }).populate("customerId", "name email subscription")

    if (!profile) {
        return next(new CustomError("Profile not found", 404))
    }
    return res.status(200).json(profile);
})

/*
 * @desc Update a user's profile
 * @route PUT /api/profile/:slug
 * @access Private
 */
export const updateProfile = expressAsyncHandler(async (req, res, next) => {
    const { slug } = req.params

    if (!slug) {
        return next(new CustomError("Slug is required to update profile", 400))
    }

    const updates = req.body

    const profile = await Profile.findOne({ slug });

    if (!profile) {
        return next(new CustomError("Profile not found", 404))
    }
    console.log(profile.customerId.toString())
    console.log(req.user)
    if (profile.customerId.toString() !== req.user) {
        return next(new CustomError("Unauthorized to update this profile", 403))
    }

    const updatedProfile = await Profile.findOneAndUpdate(
        { slug },
        updates,
        {
            new: true,
            runValidators: true,
        }
    );

    return res.status(200).json({
        message: "Profile updated successfully",
        profile: updatedProfile,
    });
})


/*
 * @desc Delete a user's profile
 * @route DELETE /api/profile/:slug
 * @access Private
 */
export const deleteProfile = expressAsyncHandler(async (req, res, next) => {
    const { slug } = req.params

    if (!slug) {
        return next(new CustomError("Slug is required to delete the profile", 400))
    }
    const profile = await Profile.findOne({ slug })

    if (!profile) {
        return next(new CustomError("Profile not found", 404))
    }

    if (profile.customerId.toString() !== req.user) {
        return next(new CustomError("Unauthorized to delete this profile", 403))
    }

    await Profile.findOneAndDelete({ slug });

    return res.status(200).json({
        message: "Profile deleted successfully",
    })
})

