import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'

// routing //
import router from './routes'

dotenv.config()

const app = express()
app.use(helmet())
app.use(cors())

// use express standard modules, not body-parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const port = process.env.PORT || 3000

app.use('/', router)

app.listen(port)
console.log(`Listen port ${port}`)
