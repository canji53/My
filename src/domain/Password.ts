import PasswordValidator from 'password-validator'

class Password {
  private readonly minLength: number = 8

  private readonly maxLength: number = 64

  private readonly blackList: string[] = ['12345678']

  private readonly schema: PasswordValidator = new PasswordValidator()

  constructor() {
    this.schema
      .is()
      .min(this.minLength)
      .is()
      .max(this.maxLength)
      .has()
      .uppercase()
      .has()
      .lowercase()
      .has()
      .not()
      .spaces()
      .is()
      .not()
      .oneOf(this.blackList)
  }

  public validate = (password: string): [boolean, string] => {
    const checkList = this.schema.validate(password, { list: true })
    const check = !(checkList.length > 0)
    const errorMessage: string =
      checkList.length > 0
        ? checkList.reduce((a, b) => `${String(a)}/${String(b)}`)
        : ''
    return [check, errorMessage]
  }
}

export default Password
