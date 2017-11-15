import ChildStore from "stores/ChildStore"
import { toJS, runInAction, observable } from "mobx"
import qs from "qs"
import history from "utils/history"
import request from "utils/request"
import logger from "utils/logger"
import BookSearchForm from "stores/BookSearchForm"
import BookEditForm from "stores/BookEditForm"

export default class BookStore extends ChildStore<IRootStore>
  implements IBookStore {
  public static PAGE_SIZE = 10
  @observable public books: IBook[]
  @observable public book?: IBook
  @observable public query: IBookQuery
  @observable public page: IPage
  public bookSearchForm: IBookSearchForm = new BookSearchForm(
    this.rootStore,
    this
  )
  public bookEditForm: IBookEditForm = new BookEditForm(this.rootStore, this)

  public async fetchBooks(query: IBookQuery = this.query) {
    try {
      runInAction(() => (this.query = query))
      const reqData = qs.stringify(toJS(this.query))
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
      logger.error(err)
    }
  }

  public async saveBook(book: IBook) {
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
      if (err.response && err.response.data.detail) {
        throw new Error(err.response.data.detail)
      }
      logger.error(err)
      throw new Error("Napotkano błąd. Spróbuj ponownie.")
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
      logger.error(err)
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
      logger.error(err)
    }
  }

  public async getBook(id: number) {
    try {
      const response = await request.get("books/" + id)
      for (const [key, value] of Object.entries(response.data)) {
        if (value == null) {
          response.data[key] = ""
        }
      }
      runInAction(() => (this.book = response.data))
    } catch (err) {
      runInAction(() => (this.book = undefined))
      logger.error(err)
    }
  }

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
}
