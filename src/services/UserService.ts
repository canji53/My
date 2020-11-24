import mongoose from 'mongoose'
import bcrypt, { hash } from 'bcrypt'
import Password from '../domain/Password'
import UserModel from '../models/UserModel'
import IUser, { IUserDocument } from '../interfaces/IUser'

class UserService {
  private readonly saltRounds = 10

  public read = async (): Promise<{
    status: number
    users?: IUserDocument[]
    message?: string
  }> => {
    const result = await UserModel.find({}, { password: 0 })
      .exec()
      .then((userDocuments) => ({
        status: 200,
        users: userDocuments,
      }))
      .catch((err: mongoose.Error) => {
        // eslint-disable-next-line no-console
        console.log(err)
        return {
          status: 500,
          message: err.message,
        }
      })
    return result
  }

  public createOne = async (
    user: IUser
  ): Promise<{
    status: number
    user?: IUserDocument
    message?: string
  }> => {
    // password check
    const password: Password = new Password()
    const [check, errorMessage] = password.validate(user.password)
    if (!check) {
      return {
        status: 400,
        message: `Must be ${errorMessage}.`,
      }
    }

    // encrypt password
    const hashedPassword = await hash(user.password, this.saltRounds)
    const createdUser = {
      name: user.name,
      password: hashedPassword,
    }

    // create
    const result = await UserModel.create(createdUser)
      .then((userDocument) => ({
        status: 201,
        user: userDocument,
      }))
      .catch((err: mongoose.Error) => {
        // eslint-disable-next-line no-console
        console.log(err)
        if (err.name === 'MongoError') {
          return {
            status: 409,
            message: err.message,
          }
        }
        return {
          status: 400,
          message: err.message,
        }
      })
    return result
  }

  public readOne = async ({
    _id,
    user,
  }: {
    _id: string
    user: IUser
  }): Promise<{
    status: number
    user?: IUserDocument
    message?: string
  }> => {
    const result = await UserModel.findById(_id)
      .exec()
      .then(async (userDocument) => {
        console.log(userDocument)
        // Not found user
        if (!userDocument) {
          return {
            status: 404,
          }
        }
        // Compare plane_pass and hash_pass
        const match: boolean = await bcrypt.compare(
          user.password,
          userDocument.password
        )
        if (!match) {
          return {
            status: 401,
          }
        }
        return {
          status: 200,
          user: userDocument,
        }
      })
      .catch((err: mongoose.Error) => {
        // eslint-disable-next-line no-console
        console.log(err)
        return {
          status: 500,
          message: err.message,
        }
      })
    return result
  }

  public updateOne = async ({
    _id,
    before,
    after,
  }: {
    _id: string
    before: IUser
    after: IUser
  }): Promise<{
    status: number
    user?: IUserDocument
    message?: string
  }> => {
    // Read
    const foundUser = await this.readOne({ _id, user: before })
    if (foundUser.user === undefined) {
      return foundUser
    }

    // Encrypt password
    const hashedPassword = await hash(after.password, this.saltRounds)
    const updatedUser: IUser = { ...after }
    updatedUser.password = hashedPassword

    // Update
    const options = { new: true, select: { password: 0 } }
    const result = await UserModel.findByIdAndUpdate(_id, updatedUser, options)
      .exec()
      .then((userDocument) => {
        // Not found user
        if (!userDocument) {
          return {
            status: 404,
          }
        }
        return {
          status: 200,
          user: userDocument,
        }
      })
      .catch((err: mongoose.Error) => {
        // eslint-disable-next-line no-console
        console.log(err)
        return {
          status: 500,
          message: err.message,
        }
      })
    return result
  }

  public deleteOne = async ({
    _id,
    user,
  }: {
    _id: string
    user: IUser
  }): Promise<{
    status: number
    user?: IUserDocument
    message?: string
  }> => {
    // Read
    const readResult = await this.readOne({ _id, user })
    if (readResult.user === undefined) {
      return readResult
    }

    // Compare plane_pass and hash_pass
    const match = await bcrypt.compare(user.password, readResult.user.password)
    if (!match) {
      return {
        status: 401,
      }
    }

    // Delete
    const result = await UserModel.findByIdAndRemove(_id)
      .exec()
      .then((userDocument) => {
        if (!userDocument) {
          return {
            status: 404,
          }
        }
        return {
          status: 204,
        }
      })
      .catch((err: mongoose.Error) => {
        // eslint-disable-next-line no-console
        console.log(err)
        return {
          status: 500,
          message: err.message,
        }
      })

    return result
  }
}

export default UserService
