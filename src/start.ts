import App from './app'
import DB from './db'

// connect db
const db = new DB()
db.connect()

// start api server
const server = new App()
server.start()
