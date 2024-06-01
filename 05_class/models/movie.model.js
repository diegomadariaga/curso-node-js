import mysql from 'mysql2/promise';
import { config } from './db-config.js';
export class MovieModel {
    static async getConnection() {
        try {
            return await mysql.createConnection(config);
        } catch (error) {
            console.error('Error connecting to the database: ', error);
            return null;
        }
    }
    static async releaseConnection(connection) {
        try {
            await connection.end();
        } catch (error) {
            console.error('Error releasing connection: ', error);
        }
    }
    static async getAllMovies({ genre }) {
        const connection = await this.getConnection();
        if (!connection) {
            return null;
        }
        try {
            if (!genre) {
                const [rows] = await connection.query(`SELECT * FROM movies`);
                return rows;
            }
            const [rows] = await connection.query(
                `SELECT * FROM movies WHERE id in (SELECT movie_id FROM movie_genres WHERE genre_id = (SELECT id FROM genres WHERE LOWER(genre) = ?))`,
                [genre.toLowerCase()]
            );
            return rows;
        } catch (error) {
            console.error('Error executing query: ', error);
            return null;
        } finally {
            this.releaseConnection(connection);
        }
    }
    static async getMovieById({ id }) {
        if (!id) {
            return null;
        }
        const connection = await this.getConnection();
        if (!connection) {
            return null;
        }
        try {
            const [rows] = await connection.query(`SELECT * FROM movies WHERE id = ?`, [id]);
            return rows[0];
        } catch (error) {
            console.error('Error executing query: ', error);
            return null;
        } finally {
            this.releaseConnection(connection);
        }
    }
    static async addMovie({ title, year, director, duration, poster, genres, rate }) {
        const id = crypto.randomUUID();
        const newMovie = { id, title, year, director, duration, poster, genres, rate };
        let connection;
        try {
            const rowsGenres = await MovieModel.findGenres(genres);
            if (rowsGenres.length !== genres.length) {
                throw new Error('Invalid genre: ' + genres);
            }
            connection = await this.getConnection();
            if (!connection) {
                return null;
            }
            await connection.beginTransaction();
            const [rows] = await connection.query(
                `INSERT INTO movies (id, title, year, director, duration, poster, rate) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [id, title, year, director, duration, poster, rate]
            );
            for (const genre of rowsGenres) {
                await connection.query(`INSERT INTO movie_genres (movie_id, genre_id) VALUES (?, ?)`, [id, genre.id]);
            }
            await connection.commit();
            return newMovie;
        } catch (error) {
            console.error('Error executing query: ', error);
            throw error;
        } finally {
            this.releaseConnection(connection);
        }
    }
    /**
     * Find genres by name
     * @param {Array} genres
     * @typedef { {id: string, genre: string} } genre
     * @returns {Promise<Array<genre>>} Array of genres
     *
     * @throws {Error} Error connecting to the database
     * @throws {Error} Error executing query
     */
    static async findGenres(genres) {
        const connection = await this.getConnection();
        if (!connection) {
            throw new Error('Error connecting to the database');
        }
        try {
            const genresLowerCase = genres.map((genre) => genre.toLowerCase());
            const [rows] = await connection.query(`SELECT * FROM genres WHERE LOWER(genre) IN (?)`, [genresLowerCase]);
            return rows;
        } catch (error) {
            console.error('Error executing query: ', error);
            throw error;
        } finally {
            this.releaseConnection(connection);
        }
    }
    static async updateMovie({ id, title, year, director, duration, poster, genre, rate }) {
        const connection = await this.getConnection();
        if (!connection) {
            return null;
        }
        try {
            await connection.beginTransaction();

            // Get the existing movie
            const [rows] = await connection.query(`SELECT * FROM movies WHERE id = ?`, [id]);
            if (rows.length === 0) {
                throw new Error('Movie not found: ' + id);
            }
            const existingMovie = rows[0];

            // Replace fields with non-undefined parameters
            const updatedMovie = {
                title: title !== undefined ? title : existingMovie.title,
                year: year !== undefined ? year : existingMovie.year,
                director: director !== undefined ? director : existingMovie.director,
                duration: duration !== undefined ? duration : existingMovie.duration,
                poster: poster !== undefined ? poster : existingMovie.poster,
                rate: rate !== undefined ? rate : existingMovie.rate,
            };

            // Update the movie
            await connection.query(
                `UPDATE movies SET title = ?, year = ?, director = ?, duration = ?, poster = ?, rate = ? WHERE id = ?`,
                [
                    updatedMovie.title,
                    updatedMovie.year,
                    updatedMovie.director,
                    updatedMovie.duration,
                    updatedMovie.poster,
                    updatedMovie.rate,
                    id,
                ]
            );

            if (genre !== undefined) {
                await connection.query(`DELETE FROM movie_genres WHERE movie_id = ?`, [id]);
                for (const genreName of genre) {
                    const [rowsGenres] = await connection.query(`SELECT id FROM genres WHERE LOWER(genre) = ?`, [
                        genreName.toLowerCase(),
                    ]);
                    if (rowsGenres.length === 0) {
                        throw new Error('Invalid genre: ' + genreName);
                    }
                    await connection.query(`INSERT INTO movie_genres (movie_id, genre_id) VALUES (?, ?)`, [id, rowsGenres[0].id]);
                }
            }

            await connection.commit();
            return { id, ...updatedMovie, genre };
        } catch (error) {
            console.error('Error executing query: ', error);
            return null;
        } finally {
            this.releaseConnection(connection);
        }
    }
    static async deleteMovie({ id }) {
        const connection = await this.getConnection();
        if (!connection) {
            return null;
        }
        try {
            const existingMovie = await this.getMovieById({ id });
            if (!existingMovie) {
                return false;
            }
            await connection.beginTransaction();
            await connection.query(`DELETE FROM movie_genres WHERE movie_id = ?`, [id]);
            await connection.query(`DELETE FROM movies WHERE id = ?`, [id]);
            await connection.commit();
            return true;
        } catch (error) {
            console.error('Error executing query: ', error);
            return false;
        } finally {
            this.releaseConnection(connection);
        }
    }
}
