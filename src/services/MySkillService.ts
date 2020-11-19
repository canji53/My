import MySkillModel from '../models/MySkillModel'
import IMySkill, { IMySkillDocuments } from '../interfaces/IMySkill'

class MySkillService {
  public reads = async (): Promise<IMySkillDocuments> => {
    const result = await MySkillModel.find()
    return result
  }

  public create = async (mySkill: IMySkill): Promise<boolean> => {
    const result = await MySkillModel.create(mySkill)
      .then(() => true)
      .catch(() => false)
    return result
  }
}

export default MySkillService
