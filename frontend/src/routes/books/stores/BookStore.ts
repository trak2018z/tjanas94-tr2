import ChildStore from "stores/ChildStore"
import { runInAction, observable, action } from "mobx"
import qs from "qs"
import history from "utils/history"
import request from "utils/request"
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
    try {
      runInAction(() => (this.query = query))
      const reqData = qs.stringify(this.query)
      const response = await request.get("books?" + reqData)
      runInAction(() => {
        this.books = response.data.results
        this.page = {
          count: response.data.count,
          last: Math.ceil(response.data.count / BookStore.PAGE_SIZE) || 1,
          current: this.query.page,
        }
      })
    } catch (err) {
      ErrorHandler.globalError(err)
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
    try {
      if (page < 1 || page > this.page.last) {
        return
      }
      runInAction(() => (this.query.page = this.page.current = page))
      await this.fetchBooks()
    } catch (err) {
      ErrorHandler.globalError(err)
    }
  }

  public getBook = async (id: number) => {
    try {
      if(this.getBookFromList(id)) {
        return
      }
      const response = await request.get("books/" + id)
      for (const [key, value] of Object.entries(response.data)) {
        if (value == null) {
          response.data[key] = ""
        }
      }
      runInAction(() => (this.book = response.data))
    } catch (err) {
      history.push("/books")
      runInAction(() => (this.book = undefined))
      ErrorHandler.globalError(err)
    }
  }

  @action.bound
  public clear() {
    this.books = []
    this.book = undefined
    this.query = {
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
    const book = this.books.find(b => b.id === Number(id))
    if (book) {
      runInAction(() => (this.book = book))
    }
    return book
  }
}
