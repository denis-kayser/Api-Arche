import { Router } from 'express'
import { userController } from '../../controllers/users/userController'


const router = Router()

// http://localhost:3000/api/v1/users
router
  .get('/users', userController)

export default router
