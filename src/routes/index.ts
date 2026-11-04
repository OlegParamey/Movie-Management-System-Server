import { Router } from 'express'
import authRoutes from './auth.routes'
import movieRoutes from './movie.routes'

const router = Router()

router.get('/health', (_req, res) =>
    res.json({ status: 'ok', time: new Date().toISOString() }),
)
router.use('/auth', authRoutes)
router.use('/movies', movieRoutes)
// TODO: reviews, lists, genres, stats, tmdb, admin

export default router
