import { Schema, model, InferSchemaType } from 'mongoose'

const reviewSchema = new Schema(
    {
        movie: { type: Schema.Types.ObjectId, ref: 'Movie', required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        rating: { type: Number, required: true, min: 1, max: 10 },
        comment: { type: String, trim: true, maxlength: 2000, default: '' },
    },
    { timestamps: true },
)

// one review per user per movie
reviewSchema.index({ movie: 1, user: 1 }, { unique: true })

export type ReviewDoc = InferSchemaType<typeof reviewSchema>
export const Review = model('Review', reviewSchema)
