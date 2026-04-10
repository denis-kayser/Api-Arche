import { Router } from 'express'
import { signInController } from '../../controllers/auth/signInController'
import { signUpController } from '../../controllers/auth/signUpController'


const router = Router()
// connect ECONNREFUSED ::1:5000

// http://localhost:5000/api/v1/auth/sign-in-credentials
// http://localhost:5000/api/v1/auth/sign-in-google
// http://localhost:5000/api/v1/auth/sign-up-credentials
// http://localhost:5000/api/v1/auth/sign-up-google
router
  .post('/auth/sign-in-credentials', signInController.Credentials) // ingresa con email y contraseña
  .post('/auth/sign-in-google', signInController.Google)  // ingresa con google
  .post('/auth/sign-up-credentials', signUpController.Credentials) //registra usuario con email y contraseña
  .post('/auth/sign-up-google', signUpController.Google)   //registra usuario con google

// .post('/auth/sign-out', userController)

// Sign in credential
// Sign out autenticated

export default router
