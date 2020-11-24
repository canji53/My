import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import ISkill, { ISkillResponse } from '../interfaces/ISkill'
import SkillService from '../services/SkillService'
import UserService from '../services/UserService'
import IUser from '../interfaces/IUser'

const app = express()
app.use(helmet())
app.use(cors())

const router = express.Router()

router.get('/', (_: express.Request, res: express.Response) => {
  res.status(200).send({ message: 'Hello, world' })
})

router.get(
  '/users',
  (_: express.Request, res: express.Response, next: express.NextFunction) => {
    const service = new UserService()
    service
      .read()
      .then(({ status, users, message }) =>
        res.status(status).send({ users, message })
      )
      .catch(next)
  }
)

router.post(
  '/users',
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const createdUser = req.body as IUser
    const service = new UserService()
    service
      .createOne(createdUser)
      .then(({ status, user, message }) =>
        res.status(status).send({ user, message })
      )
      .catch(next)
  }
)

router.get(
  '/users/:_id',
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { _id } = req.params
    const requestedUser = req.body as IUser
    const service = new UserService()
    service
      .readOne({ _id, user: requestedUser })
      .then(({ status, user, message }) => {
        res.status(status).send({ user, message })
      })
      .catch(next)
  }
)

router.put(
  '/users/:_id',
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { _id } = req.params
    const { before, after } = req.body as { before: IUser; after: IUser }
    const service = new UserService()
    service
      .updateOne({ _id, before, after })
      .then(({ status, user, message }) => {
        res.status(status).send({ user, message })
      })
      .catch(next)
  }
)

router.delete(
  '/users/:_id',
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { _id } = req.params
    const deletedUser = req.body as IUser
    const service = new UserService()
    service
      .deleteOne({ _id, user: deletedUser })
      .then(({ status, user, message }) => {
        res.status(status).send({ user, message })
      })
      .catch(next)
  }
)

router.get(
  '/skill',
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const service = new SkillService()
    service
      .reads()
      .then((result) => res.status(200).send(result))
      .catch(next)
  }
)

router.post(
  '/skill',
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const skill = req.body as ISkill // Deprecated but unavoidable ...
    const service = new SkillService()
    service
      .create(skill)
      .then((result: ISkillResponse) =>
        res.status(result.status).send({ message: result.message })
      )
      .catch(next)
  }
)

router.delete(
  '/skill/:name',
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { name } = req.params
    const service = new SkillService()
    service
      .delete(name)
      .then((result: ISkillResponse) =>
        res.status(result.status).send({ message: result.message })
      )
      .catch(next)
  }
)

// 404 not found response
app.use((req: express.Request, res: express.Response) => {
  res.status(404)
  res.render('error', {
    param: {
      status: 404,
      message: 'not found',
    },
  })
})

export default router
