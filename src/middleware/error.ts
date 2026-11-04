import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import { HttpError } from '../utils/httpError'

export function notFound(req: Request, _res: Response, next: NextFunction) {
    next(
        new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`),
    )
}

export function errorHandler(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction,
) {
    if (err instanceof HttpError) {
        return res
            .status(err.status)
            .json({
                error: {
                    code: err.status,
                    message: err.message,
                    details: err.details,
                },
            })
    }
    if (err instanceof mongoose.Error.ValidationError) {
        const details = Object.values(err.errors).map((e) => ({
            field: e.path,
            message: e.message,
        }))
        return res
            .status(400)
            .json({
                error: { code: 400, message: 'Validation failed', details },
            })
    }
    if (err instanceof mongoose.Error.CastError) {
        return res
            .status(400)
            .json({ error: { code: 400, message: `Invalid ${err.path}` } })
    }
    if (
        typeof err === 'object' &&
        err !== null &&
        (err as { code?: number }).code === 11000
    ) {
        return res
            .status(409)
            .json({ error: { code: 409, message: 'Duplicate value' } })
    }
    console.error(err)
    res.status(500).json({
        error: { code: 500, message: 'Internal server error' },
    })
}
