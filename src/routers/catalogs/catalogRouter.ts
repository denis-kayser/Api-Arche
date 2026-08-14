import { Router } from 'express'
import { documentTypeController, roleController, permissionController } from '../../controllers/catalogs/catalogController'
import { validate } from '../../middleware/validate'
import { documentTypeSchema, roleSchema, permissionSchema, permissionUpdateSchema } from '../../schemas/catalogs/catalogSchemas'

const router = Router()

// http://localhost:5000/api/v1/document-types
router
  .get('/document-types', documentTypeController.getAll)
  .post('/document-types', validate(documentTypeSchema), documentTypeController.create)
  .patch('/document-types/:id', validate(documentTypeSchema.partial()), documentTypeController.update)
  .delete('/document-types/:id', documentTypeController.remove)

// http://localhost:5000/api/v1/roles
router
  .get('/roles', roleController.getAll)
  .post('/roles', validate(roleSchema), roleController.create)
  .patch('/roles/:id', validate(roleSchema.partial()), roleController.update)
  .delete('/roles/:id', roleController.remove)

// http://localhost:5000/api/v1/permissions
router
  .get('/permissions', permissionController.getAll)
  .post('/permissions', validate(permissionSchema), permissionController.create)
  .patch('/permissions/:id', validate(permissionUpdateSchema), permissionController.update)
  .delete('/permissions/:id', permissionController.remove)

export default router
