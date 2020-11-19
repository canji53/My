/* eslint-disable no-console */
import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

class DB {
  private isValue = (value: string | undefined): string => value || ''

  private user: string = this.isValue(process.env.MONGO_USERNAME)

  private password: string = this.isValue(process.env.MONGO_PASSWORD)

  private dbName: string = this.isValue(process.env.MONGO_DBNAME)

  // Type string trivially inferred from a string literal, remove type annotation.eslint@typescript-eslint/no-inferrable-types)
  private dbUrl = `mongodb+srv://${this.user}:${this.password}@cluster0.ndrhy.mongodb.net/${this.dbName}?retryWrites=true&w=majority`

  private dbOptions: { [key: string]: boolean } = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  }

  public connect = (): void => {
    mongoose
      .connect(this.dbUrl, this.dbOptions)
      .then(() => {
        console.log('successfully connected to the database')
      })
      .catch((err) => {
        console.log('error connecting to the database')
        console.log(err)
        process.exit(-1)
      })
  }
}

export default DB
