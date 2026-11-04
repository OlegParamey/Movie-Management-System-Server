import { Router } from 'express'
import * as ctrl from '../controllers/movie.controller'
import { authenticate, requireRole } from '../middleware/auth'

const router = Router()

router.get('/', ctrl.listMovies)
router.get('/:id', ctrl.getMovie)
router.post('/', authenticate, requireRole('admin'), ctrl.createMovie)

export default router
