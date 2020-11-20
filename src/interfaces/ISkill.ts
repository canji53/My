import mongoose from 'mongoose'

export default interface ISkill {
  name: string
  level: number
  hidden: boolean
}

export interface ISkillResponse {
  status: number
  message: string
}

export interface ISkillDocument extends ISkill, mongoose.Document {}

export interface ISkillDocuments {
  [index: number]: ISkillDocument
}
