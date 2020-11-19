import mongoose from 'mongoose'
import { IMySkillDocument } from '../interfaces/IMySkill'

const mySkillSchema: mongoose.Schema = new mongoose.Schema(
  {
    skill: {
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

export default mongoose.model<IMySkillDocument>('MySkill', mySkillSchema)
