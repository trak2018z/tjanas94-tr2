import Form from "stores/Form"
import { toJS, action, runInAction, observable } from "mobx"
import request from "utils/request"
import logger from "utils/logger"
import history from "utils/history"

export default class RegisterForm extends Form<IUserStore, IRegisterData>
  implements IRegisterForm {
  @observable public validation: IRegisterValidation
  @observable public captchaId?: number

  public async sendRequest() {
    try {
      if (this.captchaId != null) {
        this.data.captcha = grecaptcha.getResponse(this.captchaId)
      }
      if (!this.isValid()) {
        return
      }
      runInAction(() => (this.pending = true))
      grecaptcha.reset(this.captchaId)
      await this.register(this.getRequestData())
      this.rootStore.messageStore.showMessage('Email z linkiem aktywacyjnym został wysłany na podany adres')
      history.push("/login")
      this.clear()
    } catch (err) {
      runInAction(
        () =>
          (this.error = {
            message: err.message,
            visible: true,
          })
      )
    }
    runInAction(() => (this.pending = false))
  }

  @action.bound
  public clear() {
    this.data = {
      email: "",
      firstname: "",
      lastname: "",
      password: "",
      confirmPassword: "",
      captcha: "",
    }
    this.error = {
      message: "",
      visible: false,
    }
    this.validation = {
      password: undefined,
      confirmPassword: undefined,
    }
    this.captchaId = undefined
  }

  @action.bound
  public validatePassword() {
    const rules = [
      /(?=[0-9]+)/,
      /(?=[A-Z]+)/,
      /(?=[a-z]+)/,
      /(?=[^a-zA-Z0-9]+)/,
      /(?=.{8,})/,
    ]
    const validPassword = rules.every(r => r.test(this.data.password))
    this.validation.password = validPassword
      ? undefined
      : "Hasło musi zawierać conajmniej 8 znaków w tym: duże litery, małe litery, liczby, znaki specjalne"

    const validConfirmPassword =
      this.data.password === this.data.confirmPassword
    this.validation.confirmPassword = validConfirmPassword
      ? undefined
      : "Hasła muszą być takie same"
  }

  private async register(data: IRegisterRequest) {
    try {
      await request.post("accounts/register", data)
    } catch (err) {
      if (err.response && err.response.status === 400) {
        throw new Error(err.response.data.detail)
      }
      logger.error(err)
      throw new Error('Napotkano błąd. Spróbuj ponownie.')
    }
  }

  private getRequestData() {
    const { confirmPassword, ...requestData } = toJS(this.data)
    return requestData
  }

  private isValid() {
    const anyThis = this as any
    return (
      Object.keys(this.validation).every(v => !anyThis[v]) &&
      !!this.data.captcha.length
    )
  }
}
