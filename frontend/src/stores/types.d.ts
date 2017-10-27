interface IStore {
  getChildStores(): any
}

interface IChildStore<T extends IStore> extends IStore {
  rootStore: IRootStore
  parentStore: T
}

interface IForm<T extends IStore, U> extends IChildStore<T> {
  data: U
  pending: boolean
  error: IMessage

  updateField(field: keyof U): (event: any) => void
  clear(): void
  submit(event: any): void
  sendRequest(): Promise<void>
}

interface IRootStore extends IStore {
  userStore: IUserStore
  getStoreMap(): any
}

interface IMessage {
  message: string
  visible: boolean
}


interface IUserStore extends IChildStore<IRootStore> {
  loginForm: ILoginForm
  user: IUser

  hasPermision(perm: string | string[]): boolean
  login(data: ILoginRequest): Promise<void>
  logout(): Promise<void>
}

interface ILoginRequest {
  username: string
  password: string
}

interface ILoginResponse {
  email: string
  firstname: string
  lastname: string
  admin: boolean
  permissions: string[]
}

interface IUser extends ILoginResponse {
  authenticated: boolean
}

type ILoginForm = IForm<IUserStore, ILoginRequest>
