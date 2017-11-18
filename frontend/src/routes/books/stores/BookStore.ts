import ChildStore from "stores/ChildStore"
import { toJS, runInAction, observable, action } from "mobx"
import qs from "qs"
import history from "utils/history"
import request from "utils/request"
import Cache from "utils/Cache"
import ErrorHandler from "utils/ErrorHandler"
import BookSearchStore from "./BookSearchStore"
import BookEditStore from "./BookEditStore"

export default class BookStore extends ChildStore<IRootStore>
  implements IBookStore {
  public static PAGE_SIZE = 10
  @observable public books: IBook[]
  @observable public book?: IBook
  @observable public query: IBookQuery
  @observable public page: IPage
  public bookSearchForm: IBookSearchStore = new BookSearchStore(
    this.rootStore,
    this
  )
  public bookEditForm: IBookEditStore = new BookEditStore(this.rootStore, this)

  public fetchBooks = async (query: IBookQuery = this.query) => {
    const cached = (await Cache.get("book:list", query)) as
      | IListResponse<IBook>
      | undefined
    try {
      runInAction(() => (this.query = query))
      const reqData = qs.stringify(this.query)
      const response = await request.get("books?" + reqData)
      Cache.save("book:list", query, response.data)
      this.updateList(response.data)
    } catch (err) {
      if (cached) {
        this.updateList(cached)
      }
      ErrorHandler.globalError(err, !!cached)
    }
  }

  public saveBook = async (book: IBook) => {
    try {
      const anyBook: any = book
      for (const [key, value] of Object.entries(anyBook)) {
        if (value === "") {
          anyBook[key] = null
        }
      }
      const response = book.id
        ? await request.put("books/" + book.id, book)
        : await request.post("books", book)
      await this.fetchBooks()
      return response.data
    } catch (err) {
      ErrorHandler.formError(err)
    }
  }

  public deleteBook = (id: number) => async () => {
    try {
      if (confirm("Czy na pewno usunąć?")) {
        await request.delete("books/" + id)
        await this.fetchBooks()
        history.push("/books")
        this.rootStore.messageStore.showMessage("Usunięto książkę")
      }
    } catch (err) {
      ErrorHandler.globalError(err)
    }
  }

  public changePage = (page: number) => async () => {
    if (page < 1 || page > this.page.last) {
      return
    }
    runInAction(() => (this.query.page = this.page.current = page))
    await this.fetchBooks()
  }

  public getBook = async (id: number) => {
    const cached = (await Cache.get("book:view", id)) as IBook | undefined
    try {
      if (this.getBookFromList(id)) {
        return
      }
      const response = await request.get("books/" + id)
      for (const [key, value] of Object.entries(response.data)) {
        if (value == null) {
          response.data[key] = ""
        }
      }
      Cache.save("book:view", id, response.data)
      runInAction(() => (this.book = response.data))
    } catch (err) {
      if (cached) {
        runInAction(() => (this.book = cached))
      } else {
        history.push("/books")
        runInAction(() => (this.book = undefined))
      }
      ErrorHandler.globalError(err, !!cached)
    }
  }

  @action.bound
  public clear() {
    this.books = []
    this.book = undefined
    this.query = {
      title: "",
      author: "",
      publication_year__gte: "",
      publication_year__lte: "",
      available: "",
      page: 1,
    }
    this.page = {
      count: 0,
      last: 1,
      current: 1,
    }
    this.clearChildStores()
  }

  private getBookFromList(id: number) {
    const book = toJS(this.books.find(b => b.id === Number(id)))
    if (book) {
      runInAction(() => (this.book = book))
      Cache.save("book:view", id, book)
    }
    return book
  }

  @action.bound
  private updateList(data: IListResponse<IBook>) {
    this.books = data.results
    this.page = {
      count: data.count,
      last: Math.ceil(data.count / BookStore.PAGE_SIZE) || 1,
      current: this.query.page,
    }
  }
}
