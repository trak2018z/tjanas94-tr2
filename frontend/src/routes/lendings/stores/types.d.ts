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


interface ILendingStore extends IChildStore<IRootStore> {
  lendingSearchForm: ILendingSearchStore
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

type ILendingSearchStore = IFormStore<ILendingStore, ILendingQuery>
