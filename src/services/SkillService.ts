import { Error } from 'mongoose'
import SkillModel from '../models/SkillModel'
import ISkill, { ISkillResponse, ISkillDocuments } from '../interfaces/ISkill'

class SkillService {
  public reads = async (): Promise<ISkillDocuments> => {
    const result = await SkillModel.find()
    return result
  }

  public create = async (skill: ISkill): Promise<ISkillResponse> => {
    const result = await SkillModel.create(skill)
      .then((_) => ({
        status: 201,
        message: 'Created',
      }))
      .catch((err: Error) => {
        // If the document is already in collections
        if (err.name === 'MongoError') {
          return { status: 409, message: err.message }
        }
        // Cast error, etc...
        if (err.name === 'ValidationError') {
          return { status: 400, message: err.message }
        }
        // Other errors
        return { status: 400, message: err.message }
      })
    return result
  }

  public delete = async (name: string): Promise<ISkillResponse> => {
    // Find target document
    const isDocument = await SkillModel.findOne({ name })
    if (!isDocument) {
      return {
        status: 410,
        message: 'Gone',
      }
    }

    // Delete op
    const result = await SkillModel.deleteOne({ name })
      .then((_) => ({
        status: 204,
        message: 'No Content',
      }))
      .catch((err: Error) => {
        return {
          status: 500,
          message: err.message,
        }
      })
    return result
  }
}

export default SkillService
