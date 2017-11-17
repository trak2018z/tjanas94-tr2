import FormStore from "stores/FormStore"
import { toJS, action } from "mobx"
import history from "utils/history"

export default class LoginFormStore extends FormStore<IUserStore, ILoginRequest>
  implements ILoginFormStore {
  public async sendRequest() {
    await this.parentStore.login(toJS(this.data))
    history.push("/")
    this.clear()
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
