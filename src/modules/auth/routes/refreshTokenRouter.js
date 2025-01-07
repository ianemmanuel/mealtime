import { createRefreshTokenRouter } from './generalRefreshTokenRouter.js'
import { Customer } from '../../customers/models/customerModel.js'
import Restaurant  from '../../restaurants/models/restaurantModel.js'
//?import { Admin } from '../models/admin/adminModel.js'


export const customerRefreshTokenRouter = createRefreshTokenRouter(Customer)
export const restaurantRefreshTokenRouter = createRefreshTokenRouter(Restaurant)
//?export const adminRefreshTokenRouter = createRefreshTokenRouter(Admin)
