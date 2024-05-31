import { Router } from 'express';
const router = Router();
import { MovieModel } from '../models/movie.model.js';
import { MovieController } from '../controllers/movie.controller.js';

router.get('/', MovieController.getAllMovies);
router.get('/:id', MovieController.getMovieById);

router.post('/', MovieController.addMovie);

router.patch('/:id', MovieController.updateMovie);

router.delete('/:id', MovieController.deleteMovie );

export default router;
