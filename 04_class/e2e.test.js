import supertest from 'supertest';
import app from './app.js';

describe('express app', () => {
    it('responds with Hello World!', async () => {
        const response = await supertest(app).get('/');
        expect(response.text).toBe('Hello World!');
    });
    describe('POST /', () => {
        it('responds with JSON', async () => {
            const body = { key: 'value' };
            const response = await supertest(app).post('/').send(body);
            expect(response.body).toEqual({ message: 'Data received', data: body });
        });
    });
    describe('MOVIES', () => {
        describe('GET /movies', () => {
            it('should return all movies', async () => {
                const response = await supertest(app).get('/movies');
                expect(response.status).toBe(200);
                expect(response.body).toBeInstanceOf(Array);
                expect(response.body.length).toBeGreaterThan(0);
            });
        });
        describe('GET /movies/:id', () => {
            it('should return a single movie', async () => {
                const id = 'dcdd0fad-a94c-4810-8acc-5f108d3b18c3';
                const response = await supertest(app).get(`/movies/${id}`);
                expect(response.status).toBe(200);
            });
            it('should return 404 if movie is not found', async () => {
                const response = await supertest(app).get('/movies/4');
                expect(response.status).toBe(404);
                expect(response.body).toEqual({ message: 'Movie not found' });
            });
        });
        describe('GET /movies?genre=...', () => {
            it('should return movies filtered by genre', async () => {
                const response = await supertest(app).get('/movies?genre=Action');
                expect(response.status).toBe(200);
                expect(response.body).toBeInstanceOf(Array);
                expect(response.body.length).toBeGreaterThan(0);
            });
            it('should return an 404 if genre is not found', async () => {
                const response = await supertest(app).get('/movies?genre=NotAGenre');
                expect(response.status).toBe(404);
                expect(response.body).toEqual([]);
            });
        });
        describe('POST /movies', () => {
            it('should add a new movie', async () => {
                const body = {
                    title: 'New Movie',
                    year: 2021,
                    director: 'Director',
                    duration: 120,
                    poster: 'https://example.com/poster.jpg',
                    genre: ['Action'],
                    rate: 5,
                };
                const response = await supertest(app).post('/movies').send(body);
                expect(response.status).toBe(201);
                expect(response.body).toEqual(expect.objectContaining(body));
            });
            it('should return 400 if data is invalid', async () => {
                const body = {
                    title: 99,
                    year: 2021,
                    director: 'Director',
                    duration: 120,
                    poster: 'https://example.com/poster.jpg',
                    genre: ['Action'],
                    rate: 10,
                };
                const response = await supertest(app).post('/movies').send(body);
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('errors');
            });
            it('should ignore additional properties', async () => {
                const body = {
                    title: 'New Movie',
                    year: 2021,
                    director: 'Director',
                    duration: 120,
                    poster: 'https://example.com/poster.jpg',
                    genre: ['Action'],
                    rate: 5,
                    extra: 'Extra property',
                };
                const response = await supertest(app).post('/movies').send(body);
                expect(response.status).toBe(201);
                expect(response.body).not.toHaveProperty('extra');
            });
        });
        describe('PATCH /movies/:id', () => {
            it('should update a movie', async () => {
                const id = 'dcdd0fad-a94c-4810-8acc-5f108d3b18c3';
                const body = {
                    title: 'Updated Movie',
                    year: 2021,
                    director: 'Director',
                    duration: 120,
                    poster: 'https://example.com/poster.jpg',
                    genre: ['Action'],
                    rate: 5,
                };
                const response = await supertest(app).patch(`/movies/${id}`).send(body);
                expect(response.status).toBe(200);
                expect(response.body).toEqual(expect.objectContaining(body));
            });
            it('should return 400 if data is invalid', async () => {
                const id = 'dcdd0fad-a94c-4810-8acc-5f108d3b18c3';
                const body = {
                    title: 99,
                    year: 2021,
                    director: 'Director',
                    duration: 120,
                    poster: 'https://example.com/poster.jpg',
                    genre: ['Action'],
                    rate: 10,
                };
                const response = await supertest(app).patch(`/movies/${id}`).send(body);
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('errors');
            });
            it('should return 404 if movie is not found', async () => {
                const id = '4';
                const body = {
                    title: 'Updated Movie',
                    year: 2021,
                    director: 'Director',
                    duration: 120,
                    poster: 'https://example.com/poster.jpg',
                    genre: ['Action'],
                    rate: 5,
                };
                const response = await supertest(app).patch(`/movies/${id}`).send(body);
                expect(response.status).toBe(404);
                expect(response.body).toEqual({ message: 'Movie not found' });
            });
        });
    });
});
