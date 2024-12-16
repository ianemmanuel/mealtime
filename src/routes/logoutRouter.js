import { logoutRouter } from './generalLogoutRouter.js'
import { Customer } from '../models/customers/customerModel.js'
import Restaurant  from '../models/restaurants/restaurantModel.js'
//?import { Admin } from '../models/admin/adminModel.js'


export const customerLogoutRouter = logoutRouter(Customer)
export const restaurantLogoutRouter = logoutRouter(Restaurant)
//?export const adminLogoutRouter = logoutRouter(Admin)
