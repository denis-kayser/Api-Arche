import { Router } from 'express'
import { sessionController } from '../../controllers/sessions/sessionController'
import { requireIdentity } from '../../middleware/requireIdentity'

const router = Router()

// http://localhost:5000/api/v1/sessions
router
  .get('/sessions', requireIdentity, sessionController.getAll)
  .delete('/sessions/:id', requireIdentity, sessionController.close)
  .get('/users/:id/sessions', requireIdentity, sessionController.getByUser)
  .post('/users/:id/sessions/close-all', requireIdentity, sessionController.closeAllByUser)

export default router
