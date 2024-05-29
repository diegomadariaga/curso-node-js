const express = require('express');
const app = express();
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
app.get('/movies', (_req, res) => {
    return res.json(movies);
});
app.get('/movies/:id', (req, res) => {
    const id = req.params.id;
    const movie = movies.find((movie) => movie.id === id);
    if (!movie) {
        return res.status(404).send({ message: 'Movie not found' });
    }
    return res.json(movie);
});

app.use((_req, res) => {
    return res.status(404).send('Not Found');
});

module.exports = app;
