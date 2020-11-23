import mongoose from 'mongoose'
import idvalidator from 'mongoose-id-validator'
import { IUserDocument } from '../interfaces/IUser'

const userSchema: mongoose.Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minlength: 1,
      maxlength: 20,
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

userSchema.plugin(idvalidator)

export default mongoose.model<IUserDocument>('User', userSchema)
