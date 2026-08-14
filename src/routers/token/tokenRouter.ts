import { Router } from 'express'
import { tokenController } from '../../controllers/token/tokenController'
import { authRateLimiter } from '../../middleware/rateLimit'

const router = Router()

// http://localhost:3000/api/v1/auth/token
router
  .post('/auth/token', authRateLimiter, tokenController)



export default router
