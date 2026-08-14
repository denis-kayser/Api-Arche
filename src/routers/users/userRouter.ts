import { Router } from 'express'
import { userController, updateUser, logoutAllDevices } from '../../controllers/users/userController'
import { validate } from '../../middleware/validate'
import { userFiltersSchema, updateUserSchema } from '../../schemas/users/userSchemas'
import { requireRole } from '../../middleware/requireRole'

const ALLOWED_ROLES_TO_KICK = ['SUPER ADMIN', 'ADMIN', 'SOPORTE']

const router = Router()

// http://localhost:3000/api/v1/users
router
  .get('/users', validate(userFiltersSchema, 'query'), userController)
  .patch('/users/:id', validate(updateUserSchema), updateUser)
  .post('/users/:userId/logout-all-devices', requireRole(ALLOWED_ROLES_TO_KICK), logoutAllDevices)

export default router
