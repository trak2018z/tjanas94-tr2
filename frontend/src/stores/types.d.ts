interface IStore {
  getChildStores(): any
  clearChildStores(): any
  clear(): void
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

interface IMessage {
  message: string
  visible: boolean
}

interface IMessageStore extends IChildStore<IRootStore> {
  message: IMessage
  showMessage(message: string, seconds?: number): void
  hideMessage(): void
}


interface IUserStore extends IChildStore<IRootStore> {
  loginForm: ILoginForm
  registerForm: IRegisterForm
  user: IUser

  hasPermision(...perm: string[]): boolean
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

interface IRegisterRequest {
  email: string
  firstname: string
  lastname: string
  password: string
  captcha: string
}

interface IRegisterData extends IRegisterRequest {
  confirmPassword: string
}

interface IRegisterValidation {
  password?: string
  confirmPassword?: string
}

interface IRegisterForm extends IForm<IUserStore, IRegisterData> {
  captchaId?: number
  validation: IRegisterValidation
  validatePassword(): void
}

interface IPage {
  last: number
  count: number
  current: number
}

interface IBook {
  id?: number
  title: string
  author?: string
  publication_year?: number
  publication_place?: string
  publishing_house?: string
  count?: number
  created?: string
  modified?: string
  available?: boolean
}

interface IBookQuery {
  title?: string
  author?: string
  available?: string
  publication_year__gte?: number
  publication_year__lte?: number
  page: number
}


interface IBookStore extends IChildStore<IRootStore> {
  bookSearchForm: IBookSearchForm
  bookEditForm: IBookEditForm
  books: IBook[]
  book?: IBook
  query: IBookQuery
  page: IPage

  fetchBooks(query?: IBookQuery): Promise<void>
  saveBook(book: IBook): Promise<IBook>
  deleteBook(id: number): () => Promise<void>
  changePage(page: number): () => Promise<void>
  getBook(id: number): Promise<void>
}

type IBookSearchForm = IForm<IBookStore, IBookQuery>
type IBookEditForm = IForm<IBookStore, IBook>


interface ILendingQuery {
  status?: number
  user?: string
  created__gte?: string
  created__lte?: string
  page: number
}

interface ILendingRequest {
  status?: number
  user?: string
  created__gte?: number
  created__lte?: number
  page: number
}

interface ILendingUser {
  email: string
  first_name: string
  last_name: string
}

interface ILendingBook {
  id: number
  title: string
}

interface ILendingHistory {
  id: number
  user: ILendingUser
  status: number
  created: string
}

interface ILending {
  id: number,
  history: ILendingHistory[]
  last_change: ILendingHistory
  book: ILendingBook
}

interface ILendingStore extends IChildStore<IRootStore> {
  lendingSearchForm: ILendingSearchForm
  lendings: ILending[]
  lending?: ILending
  query: ILendingRequest
  page: IPage
  lendingStatuses: any

  fetchLendings(query?: ILendingRequest): Promise<void>
  lendBook(id: number): () => Promise<void>
  updateLending(id: number, status: number): () => Promise<void>
  changePage(page: number): () => Promise<void>
  getLending(id: number): Promise<void>
}

type ILendingSearchForm = IForm<ILendingStore, ILendingQuery>
