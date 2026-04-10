import { Router } from 'express'
import { getPingController } from '../controllers/pingController'


const router = Router()

// http://localhost:3000/api/v1/ping
router.get('/ping', getPingController)



export default router
