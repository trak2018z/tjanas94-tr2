interface IMessage {
  message: string
  visible: boolean
}

interface IPage {
  last: number
  count: number
  current: number
}


interface IStore {
  getChildStores(): any
  clearChildStores(): any
  clear(): void
}

interface IChildStore<T extends IStore> extends IStore {
  rootStore: IRootStore
  parentStore: T
}

interface IFormStore<T extends IStore, U> extends IChildStore<T> {
  data: U
  pending: boolean
  error: IMessage

  updateField(field: keyof U): (event: any) => void
  submit(event: any): void
  sendRequest(): Promise<void>
}

interface IRootStore extends IStore {
  userStore: IUserStore
  messageStore: IMessageStore
  bookStore: IBookStore
  lendingStore: ILendingStore
  getStoreMap(): any
}

interface IMessageStore extends IChildStore<IRootStore> {
  message: IMessage
  showMessage(message: string, seconds?: number): void
  hideMessage(): void
}
