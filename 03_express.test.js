const supertest = require('supertest');
const app = require('./03_express.js');

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
});
