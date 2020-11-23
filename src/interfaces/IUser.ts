import mongoose from 'mongoose'

export default interface IUser {
  name?: string
  password: string
}

export interface IUserDocument extends IUser, mongoose.Document {}
