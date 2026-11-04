import bcrypt from 'bcryptjs'
import { User } from '../models/User'
import { MovieList } from '../models/MovieList'
import { HttpError } from '../utils/httpError'
import { signToken } from '../utils/token'

const publicUser = (u: {
    _id: unknown
    username: string
    email: string
    role: string
}) => ({
    _id: u._id,
    username: u.username,
    email: u.email,
    role: u.role,
})

export async function register(
    username: string,
    email: string,
    password: string,
) {
    if (!username || !email || !password)
        throw new HttpError(400, 'username, email and password are required')
    if (password.length < 8)
        throw new HttpError(400, 'Password must be at least 8 characters')

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ username, email, passwordHash })

    await MovieList.insertMany([
        { user: user._id, name: 'Obejrzane', type: 'watched' },
        { user: user._id, name: 'Do obejrzenia', type: 'watchlist' },
        { user: user._id, name: 'Ulubione', type: 'favorites' },
    ])

    return {
        token: signToken({ id: user.id, role: user.role }),
        user: publicUser(user),
    }
}

export async function login(email: string, password: string) {
    const user = await User.findOne({ email: email?.toLowerCase() }).select(
        '+passwordHash',
    )
    if (!user || !(await bcrypt.compare(password ?? '', user.passwordHash))) {
        throw new HttpError(401, 'Invalid email or password')
    }
    if (!user.active) throw new HttpError(403, 'Account is blocked')
    return {
        token: signToken({ id: user.id, role: user.role }),
        user: publicUser(user),
    }
}
