import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './config/env'
import routes from './routes'
import { errorHandler, notFound } from './middleware/error'

const app = express()

app.use(helmet())
app.use(cors({ origin: env.CLIENT_URL }))
app.use(morgan('dev'))
app.use(express.json())

app.use('/api', routes)

app.use(notFound)
app.use(errorHandler)

export default app
