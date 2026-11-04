import { Request, Response } from 'express'
import * as authService from '../services/auth.service'
import { User } from '../models/User'
import { HttpError } from '../utils/httpError'

export async function register(req: Request, res: Response) {
    const { username, email, password } = req.body ?? {}
    res.status(201).json(await authService.register(username, email, password))
}

export async function login(req: Request, res: Response) {
    const { email, password } = req.body ?? {}
    res.json(await authService.login(email, password))
}

export async function me(req: Request, res: Response) {
    const user = await User.findById(req.user!.id)
    if (!user) throw new HttpError(404, 'User not found')
    res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
    })
}
