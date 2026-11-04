import dotenv from 'dotenv'

dotenv.config()

const required = (name: string): string => {
    const value = process.env[name]
    if (!value)
        throw new Error(`Missing required environment variable: ${name}`)
    return value
}

export const env = {
    PORT: Number(process.env.PORT ?? 5000),
    MONGO_URI: required('MONGO_URI'),
    JWT_SECRET: required('JWT_SECRET'),
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '7d',
    CLIENT_URL: process.env.CLIENT_URL ?? 'http://localhost:5173',
    TMDB_API_KEY: process.env.TMDB_API_KEY ?? '',
}
