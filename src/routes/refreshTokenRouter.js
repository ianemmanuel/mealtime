import { createRefreshTokenRouter } from './generalRefreshTokenRouter.js'
import { Customer } from '../models/customers/customerModel.js'
import Restaurant  from '../models/restaurants/restaurantModel.js'
//?import { Admin } from '../models/admin/adminModel.js'


export const customerRefreshTokenRouter = createRefreshTokenRouter(Customer)
export const restaurantRefreshTokenRouter = createRefreshTokenRouter(Restaurant)
//?export const adminRefreshTokenRouter = createRefreshTokenRouter(Admin)
