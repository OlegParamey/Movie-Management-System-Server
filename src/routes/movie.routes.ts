import { Router } from 'express'
import * as ctrl from '../controllers/movie.controller'
import { authenticate, requireRole } from '../middleware/auth'

const router = Router()

router.get('/', ctrl.listMovies)
router.get('/:id', ctrl.getMovie)

router.post('/', authenticate, requireRole('admin'), ctrl.createMovie)
router.put('/:id', authenticate, requireRole('admin'), ctrl.updateMovie)
router.delete('/:id', authenticate, requireRole('admin'), ctrl.deleteMovie)

export default router