import mongoose from 'mongoose'
import { connectDB } from '../config/db'
import { Movie } from '../models/Movie'

const movies = [
    {
        title: 'Inception',
        year: 2010,
        genres: ['sci-fi', 'thriller'],
        director: 'Christopher Nolan',
        cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt'],
        description: 'A thief who steals secrets through dreams.',
    },
    {
        title: 'The Shawshank Redemption',
        year: 1994,
        genres: ['drama'],
        director: 'Frank Darabont',
        cast: ['Tim Robbins', 'Morgan Freeman'],
        description: 'Two imprisoned men bond over several years.',
    },
    {
        title: 'The Matrix',
        year: 1999,
        genres: ['sci-fi', 'action'],
        director: 'Lana Wachowski, Lilly Wachowski',
        cast: ['Keanu Reeves', 'Laurence Fishburne'],
        description: 'A hacker discovers the nature of reality.',
    },
]

async function run() {
    await connectDB()
    await Movie.deleteMany({})
    await Movie.insertMany(movies)
    console.log(`Seeded ${movies.length} movies`)
    await mongoose.disconnect()
}

run().catch((e) => {
    console.error(e)
    process.exit(1)
})
