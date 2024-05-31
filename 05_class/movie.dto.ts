/**
 * @class
 * @classdesc This class represents a movie.
 */
export class MovieDto {
    /** The id of the movie. */
    id?: string;

    /** The title of the movie. */
    title: string;

    /** The year the movie was released. */
    year: number;

    /** The director of the movie. */
    director: string;

    /** The duration of the movie in minutes. */
    duration: number;

    /** The URL of the movie's poster. */
    poster: string;

    /** The genre(s) of the movie. */
    genre: string[];

    /** The rating of the movie. */
    rate: number;
}
