import { Request, Response } from 'express'
import { Movie } from '../models/Movie'
import { HttpError } from '../utils/httpError'
import { MovieList } from '../models/MovieList'
import { Review } from '../models/Review'


const SORTABLE: Record<string, string> = {
    title: 'title',
    year: 'year',
    rating: 'avgRating',
}

export async function listMovies(req: Request, res: Response) {
    const {
        q,
        genre,
        year,
        director,
        minRating,
        sort = 'title',
        order = 'asc',
    } = req.query as Record<string, string>
    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20))

    const filter: Record<string, unknown> = {}
    if (q)
        filter.title = {
            $regex: q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
            $options: 'i',
        }
    if (genre) filter.genres = genre
    if (year) filter.year = Number(year)
    if (director)
        filter.director = {
            $regex: director.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
            $options: 'i',
        }
    if (minRating) filter.avgRating = { $gte: Number(minRating) }

    const sortField = SORTABLE[sort] ?? 'title'
    const [data, total] = await Promise.all([
        Movie.find(filter)
            .sort({ [sortField]: order === 'desc' ? -1 : 1 })
            .skip((page - 1) * limit)
            .limit(limit),
        Movie.countDocuments(filter),
    ])

    res.json({ data, page, limit, total, pages: Math.ceil(total / limit) })
}

export async function getMovie(req: Request, res: Response) {
    const movie = await Movie.findById(req.params.id)
    if (!movie) throw new HttpError(404, 'Movie not found')
    res.json(movie)
}

export async function createMovie(req: Request, res: Response) {
    const movie = await Movie.create(req.body)
    res.status(201).json(movie)
}



export async function updateMovie(req: Request, res: Response) {
    const { title, year, genres, director, cast, description, posterUrl } =
        req.body

    const movie = await Movie.findByIdAndUpdate(
        req.params.id,
        {
            title,
            year,
            genres,
            director,
            cast,
            description,
            posterUrl,
        },
        {
            new: true,
            runValidators: true,
        },
    )

    if (!movie) throw new HttpError(404, 'Movie not found')

    res.json(movie)
}

export async function deleteMovie(req: Request, res: Response) {
    const movie = await Movie.findByIdAndDelete(req.params.id)

    if (!movie) throw new HttpError(404, 'Movie not found')


            await MovieList.updateMany(
        { movies: movie._id },
        { $pull: { movies: movie._id } },
    )

    await Review.deleteMany({ movie: movie._id })

    res.json({ message: 'Movie deleted' })
}