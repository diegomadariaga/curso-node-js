const supertest = require('supertest');
const app = require('./03_express.js');

describe('express app', () => {   
    it('responds with Hello World!', async () => {
        const response = await supertest(app).get('/');
        expect(response.text).toBe('Hello World!');
    });
});
