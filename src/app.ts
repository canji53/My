import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import router from './routes'

dotenv.config()

class App {
  public app: express.Application

  private timeoutSeconds: number

  private port: number

  constructor() {
    this.timeoutSeconds = 30
    this.port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000
    this.app = express()
    this.app.use(helmet())
    this.app.use(cors())
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.routes() // routing
  }

  private routes = (): void => {
    this.app.use('/', router)
  }

  public start = (): void => {
    const server = this.app.listen(this.port)
    server.timeout = 1000 * this.timeoutSeconds // 1000[ms](1[s]) * 30 = 30[s]
    // eslint-disable-next-line no-console
    console.log(`Listen port ${this.port}`)
  }
}

export default App
