import { Router } from 'express'
import { sessionController } from '../../controllers/sessions/sessionController'
import { requireRole } from '../../middleware/requireRole'

const router = Router()

const ALLOWED_ROLES_TO_KICK = ['SUPER ADMIN', 'ADMIN', 'SOPORTE']

// http://localhost:5000/api/v1/sessions
router
  .get('/sessions', sessionController.getAll)
  .delete('/sessions/:id', requireRole(ALLOWED_ROLES_TO_KICK), sessionController.close)
  .get('/users/:id/sessions', sessionController.getByUser)
  .post('/users/:id/sessions/close-all', requireRole(ALLOWED_ROLES_TO_KICK), sessionController.closeAllByUser)

export default router
