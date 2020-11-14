import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { TestService } from '../services/TestService'

const app = express()
app.use(helmet())
app.use(cors())

const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).send({ message: 'Hello, world' })
})

router.get('/test', (req, res, next) => {
  const service = new TestService()
  service
    .test()
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
