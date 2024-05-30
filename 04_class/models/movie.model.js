/** @type {import ('../movie.dto.js').MovieDto []} */
import movies from '../data-movies.js';

export class MovieModel {
    static async getAllMovies({ genre }) {
        if (genre) {
            return movies.filter((movie) => movie.genre.includes(genre));
        }
        return movies;
    }
    static async getMovieById({ id }) {
        if (!id) {
            return null;
        }
        return movies.find((movie) => movie.id === id);
    }
    static async addMovie({ title, year, director, duration, poster, genre, rate }) {
        const id = crypto.randomUUID();
        const newMovie = { id, title, year, director, duration, poster, genre, rate };
        movies.push(newMovie);
        return newMovie;
    }
    static async updateMovie({ id, title, year, director, duration, poster, genre, rate }) {
        const movie = await this.getMovieById({ id });
        if (!movie) {
            return null;
        }
        const updatedMovie = { ...movie, title, year, director, duration, poster, genre, rate };
        return updatedMovie;
    }
    static async deleteMovie({ id }) {
        const index = movies.findIndex((movie) => movie.id === id);
        if (index === -1) {
            return null;
        }
        const [deletedMovie] = movies.splice(index, 1);
        return deletedMovie;
    }
}
