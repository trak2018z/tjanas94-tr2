import FormStore from "stores/FormStore"
import { toJS, action, observable } from "mobx"
import history from "utils/history"

export default class ProfileFormStore extends FormStore<
  IUserStore,
  IProfileData
> implements IProfileFormStore {
  @observable public validation: IPasswordValidation

  public async sendRequest() {
    if (!this.isValid()) {
      return
    }
    await this.parentStore.updateProfile(this.getRequestData())
    this.rootStore.messageStore.showMessage("Zaktualizowano profil")
    history.push("/profile")
  }

  @action.bound
  public clear() {
    const userData = toJS(this.parentStore.user)
    this.data = {
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      old_password: "",
      password: "",
      confirmPassword: "",
      changePassword: false,
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
    const { confirmPassword, changePassword, ...requestData } = toJS(this.data)
    if (!changePassword) {
      requestData.password = undefined
    }
    return requestData
  }

  private isValid() {
    this.validatePassword()
    return (
      !this.data.changePassword ||
      Object.entries(this.validation).every(([_, v]) => !v)
    )
  }
}
