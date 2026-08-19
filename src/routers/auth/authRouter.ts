import { Router } from 'express'
import { signInController } from '../../controllers/auth/signInController'
import { signUpController } from '../../controllers/auth/signUpController'
import { validate } from '../../middleware/validate'
import { authRateLimiter } from '../../middleware/rateLimit'
import {
  signInCredentialsSchema,
  signInGoogleSchema,
  signUpCredentialsSchema,
  signUpGoogleSchema
} from '../../schemas/auth/authSchemas'


const router = Router()
router.use(authRateLimiter)

// http://localhost:5000/api/v1/auth/sign-in-credentials
// http://localhost:5000/api/v1/auth/sign-in-google
// http://localhost:5000/api/v1/auth/sign-up-credentials
// http://localhost:5000/api/v1/auth/sign-up-google
router
  .post('/auth/sign-in-credentials', validate(signInCredentialsSchema), signInController.Credentials) // ingresa con email y contraseña
  .post('/auth/sign-in-google', validate(signInGoogleSchema), signInController.Google)  // ingresa con google
  .post('/auth/sign-up-credentials', validate(signUpCredentialsSchema), signUpController.Credentials) //registra usuario con email y contraseña
  .post('/auth/sign-up-google', validate(signUpGoogleSchema), signUpController.Google)   //registra usuario con google

// .post('/auth/sign-out', userController)

// Sign in credential
// Sign out autenticated

export default router
