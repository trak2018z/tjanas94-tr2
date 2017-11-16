import Store from "stores/Store"
import { action } from "mobx"
import MessageStore from "stores/MessageStore"
import { UserStore } from "routes/accounts"
import { BookStore } from "routes/books"
import { LendingStore } from "routes/lendings"

export default class RootStore extends Store implements IRootStore {
  public userStore: IUserStore = new UserStore(this, this)
  public messageStore: IMessageStore = new MessageStore(this, this)
  public bookStore: IBookStore = new BookStore(this, this)
  public lendingStore: ILendingStore = new LendingStore(this, this)

  constructor() {
    super()
    this.clear()
  }

  public getStoreMap() {
    return { rootStore: this, ...this.getChildStores() }
  }

  @action.bound
  public clear() {
    this.clearChildStores()
  }
}
