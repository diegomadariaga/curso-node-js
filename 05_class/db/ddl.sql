CREATE TABLE Movies (
    id VARCHAR(36) PRIMARY KEY DEFAULT UUID(),
    title VARCHAR(255) NOT NULL,
    year INT,
    director VARCHAR(255),
    duration INT,
    poster TEXT,
    rate FLOAT
);

CREATE TABLE Genres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    genre VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE MovieGenres (
    movie_id VARCHAR(36),
    genre_id INT,
    FOREIGN KEY (movie_id) REFERENCES Movies(id),
    FOREIGN KEY (genre_id) REFERENCES Genres(id)
);