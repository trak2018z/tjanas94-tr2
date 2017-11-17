import FormStore from "stores/FormStore"
import { toJS, action, runInAction, observable } from "mobx"
import history from "utils/history"

export default class ResetPasswordStep1Store extends FormStore<
  IUserStore,
  IResetPasswordStep1Request
> implements IResetPasswordStep1Store {
  @observable public captchaId?: number

  public async sendRequest() {
    if (this.captchaId != null) {
      runInAction(
        () => (this.data.captcha = grecaptcha.getResponse(this.captchaId))
      )
      if (!this.data.captcha.length) {
        return
      }
    }
    grecaptcha.reset(this.captchaId)
    await this.parentStore.resetPasswordStep1(toJS(this.data))
    this.rootStore.messageStore.showMessage(
      "Email z linkiem do zmiany hasła został wysłany na podany adres"
    )
    history.push("/")
  }

  @action.bound
  public clear() {
    this.data = {
      captcha: "",
      email: "",
    }
    this.error = {
      message: "",
      visible: false,
    }
    this.pending = false
  }
}
