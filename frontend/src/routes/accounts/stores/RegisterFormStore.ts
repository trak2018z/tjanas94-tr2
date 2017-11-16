import FormStore from "stores/FormStore"
import { toJS, action, runInAction, observable } from "mobx"
import history from "utils/history"

export default class RegisterFormStore extends FormStore<
  IUserStore,
  IRegisterData
> implements IRegisterFormStore {
  @observable public validation: IPasswordValidation
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
      await this.parentStore.register(this.getRequestData())
      this.rootStore.messageStore.showMessage(
        "Email z linkiem aktywacyjnym został wysłany na podany adres"
      )
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
      first_name: "",
      last_name: "",
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
    this.pending = false
  }

  @action.bound
  public validatePassword() {
    this.validation.password = this.parentStore.validatePassword(
      this.data.password
    )
      ? undefined
      : "Hasło musi zawierać conajmniej 8 znaków w tym: duże litery, małe litery, liczby, znaki specjalne"

    this.validation.confirmPassword =
      this.data.password === this.data.confirmPassword
        ? undefined
        : "Hasła muszą być takie same"
  }

  private getRequestData() {
    const { confirmPassword, ...requestData } = toJS(this.data)
    return requestData
  }

  private isValid() {
    this.validatePassword()
    return (
      !!this.data.captcha.length &&
      Object.entries(this.validation).every(([_, v]) => !v)
    )
  }
}
