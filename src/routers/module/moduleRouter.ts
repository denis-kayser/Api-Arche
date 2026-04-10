import { Router } from 'express'
import { moduleController } from '../../controllers/module/moduleController'


const router = Router()

// http://localhost:5000/api/v1/modules

router
  .get('/modules', moduleController) // Obtiene todos los modulos


export default router
