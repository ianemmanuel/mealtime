import { logoutRouter } from './generalLogoutRouter.js'
import { Customer } from '../../customers/models/customerModel.js'
import Restaurant  from '../../restaurants/models/restaurantModel.js'
//?import { Admin } from '../models/admin/adminModel.js'


export const customerLogoutRouter = logoutRouter(Customer)
export const restaurantLogoutRouter = logoutRouter(Restaurant)
//?export const adminLogoutRouter = logoutRouter(Admin)
