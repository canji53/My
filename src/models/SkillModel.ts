import mongoose from 'mongoose'
import { ISkillDocument } from '../interfaces/ISkill'

const skillSchema: mongoose.Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    level: {
      type: Number,
      required: true,
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
    hidden: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model<ISkillDocument>('MySkill', skillSchema)
