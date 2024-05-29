const request = require('supertest');
const app = require('./03_express.js');
let server;

describe('express app', () => {
    beforeAll((done) => {
        server = app.listen(4000, done);
    });

    it('responds with Hello World!', async () => {
        const response = await request(app).get('/');
        expect(response.text).toBe('Hello World!');
    });

    afterAll((done) => {
        server.close(done);
    });
});
