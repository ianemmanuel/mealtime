import Coupon from "../models/couponModel.js"
import Customer from "../../customers/models/customerModel.js"
import Meal from "../../meals/models/mealModel.js"
import MealPlan from "../../mealPlans/models/mealPlanModel.js"
import Restaurant from "../../restaurants/models/restaurantModel.js"
import CustomError from "../../../middleware/customError.js"

//* Utility function to validate date ranges
const isDateValid = (startDate, endDate) => {
  return new Date(startDate) <= new Date(endDate)
}

//* Utility function to check permissions
const isAuthorized = (reqUser, restaurantId) => {
  return reqUser.role === "ADMIN" || reqUser.id === restaurantId.toString()
}

//* Create a new coupon
const createCoupon = async (req, res, next) => {
  try {
    const { 
        code, 
        discountType, 
        discount,
        startDate,
        endDate, 
        usageLimit,  
        targetType, 
        targetId 
    } = req.body

    const restaurantId = req.user

    if (!code || !discountType || !discount || !maxUses || !startDate || !endDate ){
        return next(new CustomError("Missing required fields", 400))
    }

    if (!isDateValid(startDate,endDate)) {
        return next(new CustomError("Missing required fields", 400))
    }

    if (discount <= 0) {
        return next(new CustomError("Discount value must be greater than zero", 400))
    }

    //* Validate unique coupon code
    const existingCoupon = await Coupon.findOne({ code })
    if (existingCoupon) {
      return res.status(400).json({ error: "Coupon code already exists." });
    }

    // Determine the owner
    const ownerId = req.user.role === "ADMIN" ? null : restaurantId;

    // Validate target if provided
    if (targetType) {
      let target;
      if (targetType === "meal") {
        target = await Meal.findById(targetId);
      } else if (targetType === "mealPlan") {
        target = await MealPlan.findById(targetId);
      } else if (targetType === "user") {
        target = await User.findById(targetId);
      } else if (targetType === "restaurant") {
        target = await Restaurant.findById(targetId);
      }
      if (!target) {
        return res.status(404).json({ error: `${targetType} not found.` });
      }
    }

    // Create coupon
    const newCoupon = new Coupon({
      code,
      discountType,
      discountValue,
      maxUses,
      validFrom,
      validUntil,
      targetType,
      targetId,
      owner: ownerId,
    });

    await newCoupon.save();
    return res.status(201).json({ message: "Coupon created successfully.", coupon: newCoupon });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// Apply a coupon
const applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const { userId, restaurantId } = req.user

    //* Find coupon
    const coupon = await Coupon.findOne({ code, isActive: true })
    if (!coupon) {
      return res.status(404).json({ error: "Coupon not found or inactive." })
    }

    // Check if coupon is expired
    const currentDate = new Date()
    if (currentDate < new Date(coupon.validFrom) || currentDate > new Date(coupon.validUntil)) {
      return res.status(400).json({ error: "Coupon is expired or not yet valid." })
    }

    // Check usage limit
    if (coupon.usageCount >= coupon.maxUses) {
      return res.status(400).json({ error: "Coupon usage limit reached." })
    }

    // Check target restrictions
    if (coupon.targetType === "user" && coupon.targetId.toString() !== userId) {
      return res.status(403).json({ error: "Coupon not valid for this user." })
    }

    if (coupon.targetType === "restaurant" && coupon.targetId.toString() !== restaurantId) {
      return res.status(403).json({ error: "Coupon not valid for this restaurant." })
    }

    // Increment usage count
    coupon.usageCount += 1
    await coupon.save()

    return res.status(200).json({ message: "Coupon applied successfully.", discountValue: coupon.discountValue })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Internal server error." })
  }
}

// Fetch all coupons (with filtering options)
const getCoupons = async (req, res) => {
  try {
    const { role, restaurantId } = req.user

    // Admin can view all coupons
    let query = {};
    if (role !== "ADMIN") {
      query.owner = restaurantId;
    }

    const coupons = await Coupon.find(query)
    return res.status(200).json({ coupons })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Internal server error." })
  }
};

// Deactivate a coupon
const deactivateCoupon = async (req, res) => {
  try {
    const { couponId } = req.params

    // Find coupon
    const coupon = await Coupon.findById(couponId)
    if (!coupon) {
      return res.status(404).json({ error: "Coupon not found." })
    }

    // Check permissions
    if (!isAuthorized(req.user, coupon.owner)) {
      return res.status(403).json({ error: "You are not authorized to deactivate this coupon." })
    }

    // Deactivate coupon
    coupon.isActive = false
    await coupon.save()

    return res.status(200).json({ message: "Coupon deactivated successfully." })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." })
  }
}

module.exports = {
  createCoupon,
  applyCoupon,
  getCoupons,
  deactivateCoupon,
}
