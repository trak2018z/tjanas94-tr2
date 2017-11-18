import ChildStore from "stores/ChildStore"
import { runInAction, observable, action, computed } from "mobx"
import qs from "qs"
import history from "utils/history"
import request from "utils/request"
import ErrorHandler from "utils/ErrorHandler"
import LendingSearchStore from "./LendingSearchStore"

export default class LendingStore extends ChildStore<IRootStore>
  implements ILendingStore {
  public static PAGE_SIZE = 10
  @observable public lendings: ILending[]
  @observable public lending?: ILending
  @observable public query: ILendingRequest
  @observable public page: IPage
  public lendingSearchForm: ILendingSearchStore = new LendingSearchStore(
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

  @computed
  public get parameters() {
    const { page, ...reqData } = this.query
    return qs.stringify(reqData)
  }

  public fetchLendings = async (query: ILendingRequest = this.query) => {
    try {
      runInAction(() => (this.query = query))
      const reqData = qs.stringify(this.query)
      const response = await request.get("lendings?" + reqData)
      runInAction(() => {
        this.lendings = response.data.results
        this.page = {
          count: response.data.count,
          last: Math.ceil(response.data.count / LendingStore.PAGE_SIZE) || 1,
          current: this.query.page!,
        }
      })
    } catch (err) {
      ErrorHandler.globalError(err)
    }
  }

  public lendBook = (id: number) => async () => {
    if (confirm("Czy na pewno zarezerwować?")) {
      try {
        await request.post(`books/${id}/lend`)
        history.push("/books")
        this.rootStore.messageStore.showMessage("Zarezerwowano książkę")
      } catch (err) {
        ErrorHandler.globalError(err)
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
        ErrorHandler.globalError(err)
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
      ErrorHandler.globalError(err)
    }
  }

  public getLending = async (id: number) => {
    try {
      if(this.getLendingFromList(id)) {
        return
      }
      const response = await request.get("lendings/" + id)
      for (const [key, value] of Object.entries(response.data)) {
        if (value == null) {
          response.data[key] = ""
        }
      }
      runInAction(() => (this.lending = response.data))
    } catch (err) {
      history.push('/lendings')
      runInAction(() => (this.lending = undefined))
      ErrorHandler.globalError(err)
    }
  }

  @action.bound
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

  private getLendingFromList(id: number) {
    const lending = this.lendings.find(b => b.id === Number(id))
    if (lending) {
      runInAction(() => (this.lending = lending))
    }
    return lending
  }
}
