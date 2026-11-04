import { Schema, model, InferSchemaType } from 'mongoose'

const movieListSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        name: { type: String, required: true, trim: true, maxlength: 80 },
        description: { type: String, default: '' },
        type: {
            type: String,
            enum: ['watched', 'watchlist', 'favorites', 'custom'],
            default: 'custom',
        },
        movies: [{ type: Schema.Types.ObjectId, ref: 'Movie' }],
    },
    { timestamps: true },
)

export type MovieListDoc = InferSchemaType<typeof movieListSchema>
export const MovieList = model('MovieList', movieListSchema)
