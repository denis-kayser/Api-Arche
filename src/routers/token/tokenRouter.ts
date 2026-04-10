import { Router } from 'express'
import { tokenController } from '../../controllers/token/tokenController'

const router = Router()

// http://localhost:3000/api/v1/auth/token
router
  .post('/auth/token', tokenController)



export default router
