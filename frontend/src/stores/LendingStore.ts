import ChildStore from "stores/ChildStore"
import { toJS, runInAction, observable } from "mobx"
import qs from "qs"
import history from "utils/history"
import request from "utils/request"
import logger from "utils/logger"
import LendingSearchForm from "stores/LendingSearchForm"

export default class LendingStore extends ChildStore<IRootStore>
  implements ILendingStore {
  public static PAGE_SIZE = 10
  @observable public lendings: ILending[]
  @observable public lending?: ILending
  @observable public query: ILendingRequest
  @observable public page: IPage
  public lendingSearchForm: ILendingSearchForm = new LendingSearchForm(
    this.rootStore,
    this
  )

  public lendingStatuses: any = {
    1: "Zarezerwowane",
    2: "Wypożyczone",
    3: "Przedłużone",
    4: "Zwrócone",
    5: "Anulowane",
  }

  public async fetchLendings(query: ILendingRequest = this.query) {
    try {
      runInAction(() => (this.query = query))
      const reqData = qs.stringify(toJS(this.query))
      const response = await request.get("lendings?" + reqData)
      runInAction(() => {
        this.lendings = response.data.results
        this.page = {
          count: response.data.count,
          last: Math.ceil(response.data.count / LendingStore.PAGE_SIZE) || 1,
          current: this.query.page,
        }
      })
    } catch (err) {
      logger.error(err)
    }
  }

  public lendBook = (id: number) => async () => {
    if (confirm("Czy na pewno zarezerwować?")) {
      try {
        await request.post(`books/${id}/lend`)
        history.push("/books")
        this.rootStore.messageStore.showMessage("Zarezerwowano książkę")
      } catch (err) {
        if (err.response && err.response.data.detail) {
          this.rootStore.messageStore.showMessage(err.response.data.detail)
        } else {
          logger.error(err)
        }
      }
      await this.rootStore.bookStore.fetchBooks()
    }
  }

  public updateLending = (id: number, status: number) => async () => {
    if (confirm("Czy na pewno zaktualizować?")) {
      try {
        await request.post(`lendings/${id}/update`, { status })
        history.push("/lendings")
        this.rootStore.messageStore.showMessage(
          "Zaktualizowano status wypożyczenia"
        )
      } catch (err) {
        if (err.response && err.response.data.detail) {
          this.rootStore.messageStore.showMessage(err.response.data.detail)
        } else {
          logger.error(err)
        }
      }
      await this.fetchLendings()
    }
  }

  public changePage = (page: number) => async () => {
    try {
      if (page < 1 || page > this.page.last) {
        return
      }
      runInAction(() => (this.query.page = this.page.current = page))
      await this.fetchLendings()
    } catch (err) {
      logger.error(err)
    }
  }

  public async getLending(id: number) {
    try {
      const response = await request.get("lendings/" + id)
      for (const [key, value] of Object.entries(response.data)) {
        if (value == null) {
          response.data[key] = ""
        }
      }
      runInAction(() => (this.lending = response.data))
    } catch (err) {
      runInAction(() => (this.lending = undefined))
      logger.error(err)
    }
  }

  public clear() {
    this.lendings = []
    this.lending = undefined
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
