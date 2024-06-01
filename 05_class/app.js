import express, { json } from 'express';
import cors from 'cors';
import { createMovieRouter } from './routes/movies.js';
import { MovieModel } from './models/movie.model.js';
import middleware1 from './middlewares/middleware.js';
const app = express();

app.disable('x-powered-by');
app.use(json());
app.use(cors());

app.use(middleware1);

app.get('/', (_req, res) => {
    return res.send('Hello World!');
});

app.post('/', (req, res) => {
    const response = { message: 'Data received', data: req.body };
    return res.json(response);
});

//movies
app.use('/movies', createMovieRouter({ movieModel: MovieModel }));
app.use((_req, res) => {
    return res.status(404).send('Not Found');
});

export default app;
