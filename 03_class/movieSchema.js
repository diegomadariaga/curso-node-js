const { z } = require('zod');

/**
 * @param {import ('./movie.dto').MovieDto} movie
 * @returns {import ('./movie.dto').MovieDto}
 */
function validateMovie(movie) {
    return movieSchema.parse(movie);
}

const movieSchema = z.object({
    id: z.string().uuid().optional(),
    title: z.string({
        message: 'Invalid title',
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
    movieSchema,
};
