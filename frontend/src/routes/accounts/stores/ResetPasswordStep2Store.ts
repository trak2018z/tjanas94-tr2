import FormStore from "stores/FormStore"
import { toJS, action, runInAction, observable } from "mobx"
import history from "utils/history"

export default class ResetPasswordStep2Store extends FormStore<
  IUserStore,
  IResetPasswordStep2Data
> implements IResetPasswordStep2Store {
  @observable public validation: IPasswordValidation

  public async sendRequest() {
    try {
      if (!this.isValid()) {
        return
      }
      runInAction(() => (this.pending = true))
      await this.parentStore.resetPasswordStep2(this.getRequestData())
      this.rootStore.messageStore.showMessage("Zmieniono hasło")
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
      token: "",
      password: "",
      confirmPassword: "",
    }
    this.error = {
      message: "",
      visible: false,
    }
    this.validation = {
      password: undefined,
      confirmPassword: undefined,
    }
    this.pending = false
  }

  @action.bound
  public validatePassword() {
    this.validation.password = this.parentStore.validatePassword(
      this.data.password!
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
    return Object.entries(this.validation).every(([_, v]) => !v)
  }
}
