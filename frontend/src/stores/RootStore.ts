import Store from "stores/Store"
import UserStore from "stores/UserStore"
import MessageStore from "stores/MessageStore"

export default class RootStore extends Store implements IRootStore {
  public userStore: IUserStore = new UserStore(this, this)
  public messageStore: IMessageStore = new MessageStore(this, this)

  public getStoreMap() {
    return { rootStore: this, ...this.getChildStores() }
  }
}
