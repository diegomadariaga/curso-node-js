import supertest from 'supertest'
import app from './app.js'
const request = supertest(app)

describe('E2E', () => {
  describe('GET /users', () => {
    it('should return 200 OK', async () => {
      const response = await request.get('/users')
      expect(response.status).toBe(200)
    })
    it('should return an array', async () => {
      const response = await request.get('/users')
      expect(response.body).toBeInstanceOf(Array)
    })
  })
  describe('POST /users', () => {
    it('should return 201 Created', async () => {
      const response = await request.post('/users').send({
        username: 'test',
        password: 'test'
      })
      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('username', 'test')
      expect(response.body).toHaveProperty('password', 'test')
    })
  })
})
