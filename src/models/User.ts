import { Schema, model, InferSchemaType } from 'mongoose'

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 30,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true,
        },
        passwordHash: { type: String, required: true, select: false },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        active: { type: Boolean, default: true },
        avatar: { type: String, default: '' },
    },
    { timestamps: true },
)

export type UserDoc = InferSchemaType<typeof userSchema>
export const User = model('User', userSchema)
