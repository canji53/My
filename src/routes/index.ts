import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import IMySkill from '../interfaces/IMySkill'
import MySkillService from '../services/MySkillService'

const app = express()
app.use(helmet())
app.use(cors())

const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).send({ message: 'Hello, world' })
})

router.get('/skill', (req, res, next) => {
  const service = new MySkillService()
  service
    .reads()
    .then((result) => res.status(200).send(result))
    .catch(next)
})

router.post('/skill', (req, res, next) => {
  const mySkill = req.body as IMySkill // Deprecated but unavoidable ...
  const service = new MySkillService()
  service
    .create(mySkill)
    .then((result) => res.status(200).send(result))
    .catch(next)
})

// 404 not found response
app.use((req, res) => {
  res.status(404)
  res.render('error', {
    param: {
      status: 404,
      message: 'not found',
    },
  })
})

export default router
