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
  title: string
  author: string
  available: string
  publication_year__gte: string
  publication_year__lte: string
  page: number
}


interface IBookStore extends IChildStore<IRootStore> {
  bookSearchForm: IBookSearchStore
  bookEditForm: IBookEditStore
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

interface IBookEditStore extends IFormStore<IBookStore, IBook> {
  fetchBook(id?: number): Promise<void>
}

type IBookSearchStore = IFormStore<IBookStore, IBookQuery>
