import FormStore from "stores/FormStore"
import { toJS, action, runInAction } from "mobx"
import history from "utils/history"

export default class BookSearchStore extends FormStore<IBookStore, IBookQuery>
  implements IBookSearchStore {
  public async sendRequest() {
    runInAction(() => (this.data.page = 1))
    await this.parentStore.fetchBooks(toJS(this.data))
    if (!history.location.pathname.startsWith("/books")) {
      history.push("/books")
    }
  }

  @action.bound
  public clear() {
    this.data = this.copyQuery(this.parentStore.query)
    this.error = {
      message: "",
      visible: false,
    }
    this.pending = false
  }

  private copyQuery(data: IBookQuery) {
    return {
      page: data.page,
      title: data.title || "",
      author: data.author || "",
      publication_year__gte: data.publication_year__gte || "",
      publication_year__lte: data.publication_year__lte || "",
      available: data.available || "",
    }
  }
}
