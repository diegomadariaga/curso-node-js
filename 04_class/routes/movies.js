import { Router } from "express";
import { validateMovieUpdate, validateMovie } from '../movieSchema.js';
const router = Router();

/** @type {import ('../movie.dto').MovieDto []} */
import movies from '../data-movies.js';
router.get('/', (req, res) => {
    const genre = req.query.genre;
    if (typeof genre === 'string') {
        const filteredMovies = movies.filter((movie) => movie.genre.includes(genre));
        if (filteredMovies.length === 0) {
            return res.status(404).send([]);
        }
        return res.json(filteredMovies);
    }
    return res.json(movies);
});
router.get('/:id', (req, res) => {
    try {
        const id = req.params.id;
        const movie = movies.find((movie) => movie.id === id);
        if (!movie) {
            return res.status(404).send({ message: 'Movie not found' });
        }
        return res.json(movie);
    } catch (err) {
        return res.status(500).send({ message: 'Server error' });
    }
});

router.post('/', (req, res) => {
    try {
        const body = validateMovie(req.body);
        if (!body.success) {
            return res.status(400).send({ errors: body.error.errors });
        }
        const { title, year, director, duration, poster, genre, rate } = body.data;
        const id = crypto.randomUUID();
        const newMovie = { id, title, year, director, duration, poster, genre, rate };
        movies.push(newMovie);
        return res.status(201).json(newMovie);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Server error' });
    }
});

router.patch('/:id', (req, res) => {
    try {
        const id = req.params.id;
        const movie = movies.find((movie) => movie.id === id);
        if (!movie) {
            return res.status(404).send({ message: 'Movie not found' });
        }
        const body = validateMovieUpdate(req.body);
        if (!body.success) {
            return res.status(400).send({ errors: body.error.errors });
        }
        const updatedMovie = { ...movie, ...body.data };
        // save updated movie into database
        return res.json(updatedMovie);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Server error' });
    }
});

export default router;