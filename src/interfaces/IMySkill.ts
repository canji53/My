import mongoose from 'mongoose'

export default interface IMySkill {
  skill: string
  level: number
  hidden: boolean
}

export interface IMySkillDocument extends IMySkill, mongoose.Document {}

export interface IMySkillDocuments {
  [index: number]: IMySkillDocument
}