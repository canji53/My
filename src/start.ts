import App from './app'
import DB from './db'

// connect db
const db = new DB()
// eslint-disable-next-line @typescript-eslint/no-floating-promises
db.connect()

// start api server
const server = new App()
server.start()
