import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import ISkill, { ISkillResponse } from '../interfaces/ISkill'
import SkillService from '../services/SkillService'

const app = express()
app.use(helmet())
app.use(cors())

const router = express.Router()

router.get('/', (req: express.Request, res: express.Response) => {
  res.status(200).send({ message: 'Hello, world' })
})

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
