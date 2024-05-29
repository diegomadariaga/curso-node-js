const supertest = require('supertest');
const app = require('./routes.js');

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
                expect(response.body).toEqual([
                    { id: 1, title: 'Inception' },
                    { id: 2, title: 'Interstellar' },
                    { id: 3, title: 'Dunkirk' },
                ]);
            });
        });
        describe('GET /movies/:id', () => {
            it('should return a single movie', async () => {
                const response = await supertest(app).get('/movies/1');
                expect(response.status).toBe(200);
                expect(response.body).toEqual({ id: 1, title: 'Inception' });
            });
            it('should return 404 if movie is not found', async () => {
                const response = await supertest(app).get('/movies/4');
                expect(response.status).toBe(404);
                expect(response.body).toEqual({ message: 'Movie not found' });
            });
        });
    });
});
