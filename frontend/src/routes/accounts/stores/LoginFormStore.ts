import FormStore from "stores/FormStore"
import { toJS, action, runInAction } from "mobx"
import history from "utils/history"

export default class LoginFormStore extends FormStore<IUserStore, ILoginRequest>
  implements ILoginFormStore {
  public async sendRequest() {
    try {
      runInAction(() => (this.pending = true))
      await this.parentStore.login(toJS(this.data))
      history.push("/")
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
    this.pending = false
  }
}
