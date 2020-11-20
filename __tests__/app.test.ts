import request from 'supertest'
import App from '../src/app'
import DB from '../src/db'

import ISkill from '../src/interfaces/ISkill'

// connect db
const db: DB = new DB()
db.connect()

describe('GET /skill', () => {
  test('return 200', async (done: jest.DoneCallback) => {
    const server: App = new App()
    const response = await request(server.app).get('/skill')
    expect(response.status).toBe(200)
    done()
  })
})

describe('POST /skill', () => {
  test('return 201', async (done: jest.DoneCallback) => {
    const server: App = new App()
    const requestBody: ISkill = { name: 'xxx', level: 0.2, hidden: false }
    const response = await request(server.app).post('/skill').send(requestBody)
    expect(response.status).toBe(201)
    expect(response.body).toEqual({ message: 'Created' })
    done()
  })

  test('return 409 (Conflict)', async (done: jest.DoneCallback) => {
    const server: App = new App()
    const requestBody: ISkill = { name: 'xxx', level: 0.2, hidden: false }
    const response = await request(server.app).post('/skill').send(requestBody)
    expect(response.status).toBe(409)
    done()
  })

  test('return 400 (CastError)', async (done: jest.DoneCallback) => {
    const server: App = new App()
    const requestBody: any = { skill: 'yyy', level: 'ds', hidden: false }
    const response = await request(server.app).post('/skill').send(requestBody)
    expect(response.status).toBe(400)
    done()
  })
})

describe('DELETE /skill', () => {
  test('return 204', async (done: jest.DoneCallback) => {
    const server: App = new App()
    const response = await request(server.app).delete('/skill/xxx')
    expect(response.status).toBe(204)
    done()
  })

  test('return 410 (Gone)', async (done: jest.DoneCallback) => {
    const server: App = new App()
    const response = await request(server.app).delete('/skill/dsdsdsds')
    expect(response.status).toBe(410)
    expect(response.body).toEqual({ message: 'Gone' })
    done()
  })
})
