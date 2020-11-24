import dotenv from 'dotenv'
import request from 'supertest'

import App from '../src/app'
import DB from '../src/db'
import IUser, { IUserDocument } from '../src/interfaces/IUser'

dotenv.config()

const db: DB = new DB()

beforeAll(async () => {
  await db.connect()
})

afterAll(async () => {
  await db.close()
})

describe('/users', () => {
  describe('/users GET', () => {
    test('200', async (done: jest.DoneCallback) => {
      const server: App = new App()
      const response = await request(server.app).get('/users')
      expect(response.status).toBe(200)
      done()
    })
  })

  describe('/users POST', () => {
    test('409 Conflict user', async (done: jest.DoneCallback) => {
      const server: App = new App()
      const requestBody: IUser = {
        name: process.env.TEST_USER_NAME || '',
        password: process.env.TEST_USER_PASSWORD || '',
      }
      const response = await request(server.app)
        .post('/users')
        .send(requestBody)
      expect(response.status).toBe(409)
      done()
    })

    test('400 Name is required', async (done: jest.DoneCallback) => {
      const server: App = new App()
      const requestBody: IUser = {
        name: '',
        password: '4m9JKukDy4l1',
      }
      const response = await request(server.app)
        .post('/users')
        .send(requestBody)
      expect(response.status).toBe(400)
      done()
    })

    test('400 Password is required', async (done: jest.DoneCallback) => {
      const server: App = new App()
      const requestBody: IUser = {
        name: 'tege',
        password: '',
      }
      const response = await request(server.app)
        .post('/users')
        .send(requestBody)
      expect(response.status).toBe(400)
      done()
    })

    test('400 Name is longer than 20', async (done: jest.DoneCallback) => {
      const server: App = new App()
      const requestBody: IUser = {
        name: 'hogetegehogetegehogetege',
        password: 'ER42ZlXgJ75u',
      }
      const response = await request(server.app)
        .post('/users')
        .send(requestBody)
      expect(response.status).toBe(400)
      done()
    })
  })

  describe('/users/:_id', () => {
    describe('/users/:_id GET', () => {
      test('200', async (done: jest.DoneCallback) => {
        const server: App = new App()
        const requestedUser: IUser = {
          name: 'test',
          password: process.env.TEST_USER_PASSWORD || '',
        }
        console.log(process.env.TEST_USER_ID, requestedUser)
        const response = await request(server.app)
          .get(`/users/${process.env.TEST_USER_ID || ''}`)
          .send(requestedUser)
        expect(response.status).toBe(200)
        done()
      })

      test('401 Unauthorized', async (done: jest.DoneCallback) => {
        const server: App = new App()
        const requestedUser: IUser = {
          name: 'test',
          password: 'fakepassword',
        }
        console.log(process.env.TEST_USER_ID, requestedUser)
        const response = await request(server.app)
          .get(`/users/${process.env.TEST_USER_ID || ''}`)
          .send(requestedUser)
        expect(response.status).toBe(401)
        done()
      })

      test('404 Not found user', async (done: jest.DoneCallback) => {
        const server: App = new App()
        const requestedUser: IUser = {
          name: process.env.TEST_USER_NAME || '',
          password: process.env.TEST_USER_PASSWORD || '',
        }
        const response = await request(server.app)
          .get('/users/5fba522fb41ff516b113d72f')
          .send(requestedUser)
        expect(response.status).toBe(404)
        done()
      })

      test('500 Invalid Id', async (done: jest.DoneCallback) => {
        const server: App = new App()
        const requestedUser: IUser = {
          name: process.env.TEST_USER_NAME || '',
          password: process.env.TEST_USER_PASSWORD || '',
        }
        const response = await request(server.app)
          .get('/users/5fba51f')
          .send(requestedUser)
        expect(response.status).toBe(500)
        done()
      })
    })

    describe('/users/:_id PUT', () => {
      afterAll(async () => {
        // Undo updated user informations
        const server: App = new App()
        const requestBody: { before: IUser; after: IUser } = {
          before: {
            name: 'fuga',
            password: 'uXEcQchixq0ySRrb9a54cVDc3BVFMgNR',
          },
          after: {
            name: process.env.TEST_USER_NAME || '',
            password: process.env.TEST_USER_PASSWORD || '',
          },
        }
        const _ = await request(server.app)
          .put(`/users/${process.env.TEST_USER_ID || ''}`)
          .send(requestBody)
      })

      test('200', async (done: jest.DoneCallback) => {
        const server: App = new App()
        const requestBody: { before: IUser; after: IUser } = {
          before: {
            name: process.env.TEST_USER_NAME || '',
            password: process.env.TEST_USER_PASSWORD || '',
          },
          after: {
            name: 'fuga',
            password: 'uXEcQchixq0ySRrb9a54cVDc3BVFMgNR',
          },
        }
        const response = await request(server.app)
          .put(`/users/${process.env.TEST_USER_ID || ''}`)
          .send(requestBody)
        expect(response.status).toBe(200)
        done()
      })
    })
  })

  describe('/users POST => /users/:_id DELETE', () => {
    test('User created and deleted', async (done: jest.DoneCallback) => {
      const server: App = new App()
      const requestBody: IUser = {
        name: 'hoge',
        password: 'UNDwRmQzjCA0',
      }
      // create
      const postResponse = await request(server.app)
        .post('/users')
        .send(requestBody)
      expect(postResponse.status).toBe(201)
      // delete
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const user = postResponse.body.user as IUserDocument
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { _id }: { _id: string } = user
      const deleteResponse = await request(server.app)
        .delete(`/users/${_id}`)
        .send(requestBody)
      expect(deleteResponse.status).toBe(204)
      done()
    })
  })
})
