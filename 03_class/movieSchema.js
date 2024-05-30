const { z } = require('zod');

/**
 * @param {import ('./movie.dto').MovieDto} movie
 */
function validateMovie(movie) {
    return movieSchema.safeParse(movie);
}
function validateMovieUpdate(movie) {
    return movieSchema.partial().safeParse(movie);
}

const movieSchema = z.object({
    title: z.string({
        invalid_type_error: 'Title must be a string',
        required_error: 'Title is required',
    }),
    year: z.number().int().positive().min(1900),
    director: z.string(),
    duration: z.number(),
    poster: z.string().url({ message: 'Invalid URL' }),
    genre: z.array(z.enum(['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Thriller', 'Western'])),
    rate: z.number(),
});

module.exports = {
    validateMovie,
    validateMovieUpdate,
};
