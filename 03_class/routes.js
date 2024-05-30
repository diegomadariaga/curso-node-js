const express = require('express');
const app = express();
const { movieSchema, validateMovie } = require('./movieSchema');

/** @type {import ('./movie.dto').MovieDto []} */
const movies = require('./movies.json');

app.disable('x-powered-by');
app.use(express.json());

app.use((_req, _res, next) => {
    console.log('middleware 1');
    return next();
});

app.get('/', (_req, res) => {
    return res.send('Hello World!');
});

app.post('/', (req, res) => {
    const response = { message: 'Data received', data: req.body };
    return res.json(response);
});

//movies
app.get('/movies', (req, res) => {
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
app.get('/movies/:id', (req, res) => {
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

app.post('/movies', (req, res) => {
    const { title, year, director, duration, poster, genre, rate } = req.body;
    const id = crypto.randomUUID();
    const newMovie = { id, title, year, director, duration, poster, genre, rate };
    movies.push(newMovie);
    return res.status(201).json(newMovie);
});

app.use((_req, res) => {
    return res.status(404).send('Not Found');
});

module.exports = app;
