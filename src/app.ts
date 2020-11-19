/* eslint-disable no-console */
import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import mongoose from 'mongoose'
// custom routing
import router from './routes'

dotenv.config()

/* mongodb */
// connection_url
const isValue = (value: string | undefined): string => value || ''
const user: string = isValue(process.env.MONGO_USERNAME)
const password: string = isValue(process.env.MONGO_PASSWORD)
const dbName: string = isValue(process.env.MONGO_DBNAME)
const dbUrl = `mongodb+srv://${user}:${password}@cluster0.ndrhy.mongodb.net/${dbName}?retryWrites=true&w=majority`
// options
const dbOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
}
// connect
mongoose
  .connect(dbUrl, dbOptions)
  .then(() => {
    console.log('successfully connected to the database')
  })
  .catch((err) => {
    console.log('error connecting to the database')
    console.log(err)
    process.exit()
  })

/* express */
const app = express()
const port = process.env.PORT || 3000
app.use(helmet())
app.use(cors())
app.use(express.json()) // use express standard modules
app.use(express.urlencoded({ extended: true })) // use express standard modules
app.use('/', router)
const server = app.listen(port)
server.timeout = 1000 * 30 * 1 // 1000[ms](1[s]) * 30 * 1 = 30[s]
console.log(`Listen port ${port}`)
