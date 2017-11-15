import ChildStore from "stores/ChildStore"
import { observable, action } from "mobx"
import cookie from "js-cookie"

export default class MessageStore extends ChildStore<IRootStore>
  implements IMessageStore {
  @observable public message: IMessage

  public showMessage = action((message: string, seconds: number = 10) => {
    if (this.timeout != null) {
      clearTimeout(this.timeout)
    }

    this.message = {
      message,
      visible: true,
    }

    this.timeout = setTimeout(this.hideMessage, seconds * 1000)
  })

  public hideMessage = action(() => {
    if (this.timeout != null) {
      clearTimeout(this.timeout)
      this.timeout = undefined
    }

    this.message = {
      message: "",
      visible: false,
    }
  })

  @observable private timeout?: NodeJS.Timer

  private messageMap: any = {
    invalid_token: 'Nieprawidłowy link aktywacyjny',
    activation_success: 'Konto zostało aktywowane. Możesz się zalogować',
  }

  constructor(rootStore: IRootStore, parentStore: IRootStore) {
    super(rootStore, parentStore)
    const message = cookie.get('message')
    if (message && this.messageMap[message]) {
      this.showMessage(this.messageMap[message])
      cookie.remove('message')
    }
  }

  public clear() {
    if (this.message == null) {
      this.message = {
        message: "",
        visible: false
      }
    }
  }
}
