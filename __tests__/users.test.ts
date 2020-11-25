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
      const response: {
        status: number
        users?: IUserDocument[]
        message?: string
      } = await request(server.app).get('/users')
      expect(response.status).toBe(200)
      done()
    })
  })

  describe('/users POST', () => {
    // user info
    let userId: string
    const userName = 'hoge'
    const userPassword = '2esPaIGivk2@'

    test('201', async (done: jest.DoneCallback) => {
      const server: App = new App()
      const requestBody: IUser = {
        name: userName,
        password: userPassword,
      }
      const response = await request(server.app)
        .post('/users')
        .send(requestBody)
      expect(response.status).toBe(201)
      const { user } = response.body as { user: IUserDocument; message: string }
      // eslint-disable-next-line no-underscore-dangle
      userId = user._id as string
      done()
    })

    test('409 Conflict user', async (done: jest.DoneCallback) => {
      const server: App = new App()
      const requestBody: IUser = {
        name: userName,
        password: userPassword,
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
        password: 'l*gT81GuMINd',
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
        password: 'l*gT81GuMINd',
      }
      const response = await request(server.app)
        .post('/users')
        .send(requestBody)
      expect(response.status).toBe(400)
      done()
    })

    test('Delete user', async (done: jest.DoneCallback) => {
      const server: App = new App()
      const requestBody: IUser = {
        name: userName,
        password: userPassword,
      }
      const response: {
        status: number
        user?: IUserDocument
        message?: string
      } = await request(server.app).delete(`/users/${userId}`).send(requestBody)
      expect(response.status).toBe(204)
      done()
    })
  })

  describe('/users/:_id', () => {
    describe('/users/:_id GET', () => {
      // user info
      let userId: string
      const userName = 'hoge'
      const userPassword = '2esPaIGivk2@'

      test('Create user', async (done: jest.DoneCallback) => {
        const server: App = new App()
        const requestBody: IUser = {
          name: userName,
          password: userPassword,
        }
        const response = await request(server.app)
          .post('/users')
          .send(requestBody)
        expect(response.status).toBe(201)
        const { user } = response.body as {
          user: IUserDocument
          message: string
        }
        // eslint-disable-next-line no-underscore-dangle
        userId = user._id as string
        done()
      })

      test('200', async (done: jest.DoneCallback) => {
        const server: App = new App()
        const requestBody: IUser = {
          name: userName,
          password: userPassword,
        }
        const response = await request(server.app)
          .get(`/users/${userId}`)
          .send(requestBody)
        // const { user } = response.body as { user: IUserDocument }
        expect(response.status).toBe(200)
        // expect(user).toMatchObject(requestBody)
        done()
      })

      test('401 Unauthorized', async (done: jest.DoneCallback) => {
        const server: App = new App()
        const requestBody: IUser = {
          name: userName,
          password: 'fakepassword',
        }
        const response = await request(server.app)
          .get(`/users/${userId}`)
          .send(requestBody)
        expect(response.status).toBe(401)
        done()
      })

      test('404 Not found user', async (done: jest.DoneCallback) => {
        const server: App = new App()
        const requestBody: IUser = {
          name: userName,
          password: userPassword,
        }
        const response = await request(server.app)
          .get('/users/5fba522fb41ff516b113d72f')
          .send(requestBody)
        expect(response.status).toBe(404)
        done()
      })

      test('500 Invalid Id', async (done: jest.DoneCallback) => {
        const server: App = new App()
        const requestBody: IUser = {
          name: userName,
          password: userPassword,
        }
        const response = await request(server.app)
          .get('/users/5fba51f')
          .send(requestBody)
        expect(response.status).toBe(500)
        done()
      })

      test('Delete user', async (done: jest.DoneCallback) => {
        const server: App = new App()
        const requestBody: IUser = {
          name: userName,
          password: userPassword,
        }
        const response = await request(server.app)
          .delete(`/users/${userId}`)
          .send(requestBody)
        expect(response.status).toBe(204)
        done()
      })
    })

    describe('/users/:_id PUT', () => {
      // user info
      let userId: string
      const userName = 'hoge'
      const userPassword = '2esPaIGivk2@'
      const afterUserName = 'fuga'
      const afterUserPassword = 'uXEcQchixq0ySRrb9a54cVDc3BVFMgNR'

      test('Create user', async (done: jest.DoneCallback) => {
        const server: App = new App()
        const requestBody: IUser = {
          name: userName,
          password: userPassword,
        }
        const response = await request(server.app)
          .post('/users')
          .send(requestBody)
        expect(response.status).toBe(201)
        const { user } = response.body as {
          user: IUserDocument
          message: string
        }
        // eslint-disable-next-line no-underscore-dangle
        userId = user._id as string
        done()
      })

      test('200', async (done: jest.DoneCallback) => {
        const server: App = new App()
        const requestBody: { before: IUser; after: IUser } = {
          before: {
            name: userName,
            password: userPassword,
          },
          after: {
            name: afterUserName,
            password: afterUserPassword,
          },
        }
        const response = await request(server.app)
          .put(`/users/${userId}`)
          .send(requestBody)
        expect(response.status).toBe(200)
        done()
      })

      test('Delete user', async (done: jest.DoneCallback) => {
        const server: App = new App()
        const requestBody: IUser = {
          name: afterUserName,
          password: afterUserPassword,
        }
        const response: {
          status: number
          user?: IUserDocument
          message?: string
        } = await request(server.app)
          .delete(`/users/${userId}`)
          .send(requestBody)
        expect(response.status).toBe(204)
        done()
      })
    })

    describe('/users/:_id DELETE', () => {
      // user info
      let userId: string
      const userName = 'hoge'
      const userPassword = '2esPaIGivk2@'

      test('Create user', async (done: jest.DoneCallback) => {
        const server: App = new App()
        const requestBody: IUser = {
          name: userName,
          password: userPassword,
        }
        const response = await request(server.app)
          .post('/users')
          .send(requestBody)
        expect(response.status).toBe(201)
        const { user } = response.body as {
          user: IUserDocument
          message: string
        }
        // eslint-disable-next-line no-underscore-dangle
        userId = user._id as string
        done()
      })

      test('401', async (done: jest.DoneCallback) => {
        const server: App = new App()
        const requestBody: IUser = {
          name: userName,
          password: `${userPassword}xxxx`,
        }
        const response = await request(server.app)
          .delete(`/users/${userId}`)
          .send(requestBody)
        expect(response.status).toBe(401)
        done()
      })

      test('204', async (done: jest.DoneCallback) => {
        const server: App = new App()
        const requestBody: IUser = {
          name: userName,
          password: userPassword,
        }
        const response = await request(server.app)
          .delete(`/users/${userId}`)
          .send(requestBody)
        expect(response.status).toBe(204)
        done()
      })
    })
  })

  describe('/users/name/:name', () => {
    let userId: string
    const userName = 'hoge'
    const userPassword = '2esPaIGivk2@'

    describe('/users/name/:name GET', () => {
      test('Create user', async (done: jest.DoneCallback) => {
        const server: App = new App()
        const requestBody: IUser = {
          name: userName,
          password: userPassword,
        }
        const response = await request(server.app)
          .post('/users')
          .send(requestBody)
        expect(response.status).toBe(201)
        const { user } = response.body as {
          user: IUserDocument
          message: string
        }
        // eslint-disable-next-line no-underscore-dangle
        userId = user._id as string
        done()
      })

      test('200', async (done: jest.DoneCallback) => {
        const server: App = new App()
        const requestBody: { password: string } = { password: userPassword }
        const response = await request(server.app)
          .get(`/users/name/${userName}`)
          .send(requestBody)
        expect(response.status).toBe(200)
        done()
      })

      test('Delete user', async (done: jest.DoneCallback) => {
        const server: App = new App()
        const requestBody: IUser = {
          name: userName,
          password: userPassword,
        }
        const response = await request(server.app)
          .delete(`/users/${userId}`)
          .send(requestBody)
        expect(response.status).toBe(204)
        done()
      })
    })
  })
})
