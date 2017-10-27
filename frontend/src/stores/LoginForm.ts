import Form from "stores/Form"
import { toJS, action, runInAction } from "mobx"

export default class LoginForm extends Form<IUserStore, ILoginRequest>
  implements ILoginForm {
  @action.bound
  public async sendRequest() {
    try {
      runInAction(() => (this.pending = true))
      await this.parentStore.login(toJS(this.data))
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
      username: "",
      password: "",
    }
    this.error = {
      message: "",
      visible: false,
    }
  }
}
