import Store from "stores/Store"
import UserStore from "stores/UserStore"

export default class RootStore extends Store implements IRootStore {
  public userStore: IUserStore = new UserStore(this, this)

  public getStoreMap() {
    return { rootStore: this, ...this.getChildStores() }
  }
}
