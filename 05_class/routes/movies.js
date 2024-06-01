import { Router } from 'express';
const router = Router();
import { MovieController } from '../controllers/movie.controller.js';

export const createMovieRouter = ({movieModel}) => {
    const movieConstroller = new MovieController({ movieModel });

    router.get('/', movieConstroller.getAllMovies);
    router.get('/:id', movieConstroller.getMovieById);
    router.post('/', movieConstroller.addMovie);
    router.patch('/:id', movieConstroller.updateMovie);
    router.delete('/:id', movieConstroller.deleteMovie);

    return router;
};

