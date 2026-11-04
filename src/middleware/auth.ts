import { NextFunction, Request, Response } from 'express'
import { HttpError } from '../utils/httpError'
import { verifyToken } from '../utils/token'

export function authenticate(req: Request, _res: Response, next: NextFunction) {
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer '))
        throw new HttpError(401, 'Missing or invalid Authorization header')
    try {
        const { id, role } = verifyToken(header.slice(7))
        req.user = { id, role }
        next()
    } catch {
        throw new HttpError(401, 'Invalid or expired token')
    }
}

export const requireRole =
    (...roles: Array<'user' | 'admin'>) =>
    (req: Request, _res: Response, next: NextFunction) => {
        if (!req.user) throw new HttpError(401, 'Not authenticated')
        if (!roles.includes(req.user.role))
            throw new HttpError(403, 'Forbidden')
        next()
    }
