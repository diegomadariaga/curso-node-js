import { MovieModel } from '../models/movie.model.js';
import { validateMovieUpdate, validateMovie } from '../movieSchema.js';
export class MovieController {
    static async getAllMovies(req, res) {
        const genre = req.query.genre;
        const movies = await MovieModel.getAllMovies({ genre });
        if (genre && movies.length === 0) {
            return res.status(404).json([]);
        }
        return res.json(movies);
    }
    static async getMovieById(req, res) {
        try {
            const id = req.params.id;
            const movie = await MovieModel.getMovieById({ id });
            if (!movie) {
                return res.status(404).send({ message: 'Movie not found' });
            }
            return res.json(movie);
        } catch (err) {
            console.error('error while getting movie by id', err);
            return res.status(500).send({ message: 'Server error' });
        }
    }
    static async addMovie(req, res) {
        try {
            const body = validateMovie(req.body);
            if (!body.success) {
                return res.status(400).send({ errors: body.error.errors });
            }
            const { title, year, director, duration, poster, genre, rate } = body.data;
            const newMovie = await MovieModel.addMovie({ title, year, director, duration, poster, genre, rate });
            return res.status(201).json(newMovie);
        } catch (err) {
            console.error('error while adding movie', err);
            return res.status(500).send({ message: 'Server error' });
        }
    }
    static async updateMovie(req, res) {
        try {
            const id = req.params.id;
            const body = validateMovieUpdate(req.body);
            if (!body.success) {
                return res.status(400).send({ errors: body.error.errors });
            }
            const updatedMovie = await MovieModel.updateMovie({
                id,
                title: body.data.title,
                year: body.data.year,
                director: body.data.director,
                duration: body.data.duration,
                poster: body.data.poster,
                genre: body.data.genre,
                rate: body.data.rate,
            });
            if (!updatedMovie) {
                return res.status(404).send({ message: 'Movie not found' });
            }

            return res.json(updatedMovie);
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: 'Server error' });
        }
    }
    static async deleteMovie(req, res) {
        try {
            const id = req.params.id;
            const deletedMovie = await MovieModel.deleteMovie({ id });
            if (!deletedMovie) {
                return res.status(404).send({ message: 'Movie not found' });
            }
            return res.json(deletedMovie);
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: 'Server error' });
        }
    }
}
