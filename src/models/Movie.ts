import { Schema, model, InferSchemaType } from 'mongoose'

const movieSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        year: { type: Number, min: 1888, max: 2100 },
        genres: { type: [String], default: [] },
        director: { type: String, trim: true, default: '' },
        cast: { type: [String], default: [] },
        description: { type: String, default: '' },
        posterUrl: { type: String, default: '' },
        tmdbId: { type: Number, unique: true, sparse: true },
        avgRating: { type: Number, default: 0 },
        reviewsCount: { type: Number, default: 0 },
    },
    { timestamps: true },
)

movieSchema.index({ title: 'text', director: 'text' })
movieSchema.index({ genres: 1 })
movieSchema.index({ year: 1 })
movieSchema.index({ avgRating: -1 })

export type MovieDoc = InferSchemaType<typeof movieSchema>
export const Movie = model('Movie', movieSchema)
