import Form from "stores/Form"
import { toJS, action, runInAction } from "mobx"
import history from "utils/history"

export default class BookSearchForm extends Form<IBookStore, IBookQuery>
  implements IBookSearchForm {
  public async sendRequest() {
    try {
      runInAction(() => {
        this.pending = true
        this.data.page = 1
      })
      await this.parentStore.fetchBooks(toJS(this.data))
      if (!history.location.pathname.startsWith('/books')) {
        history.push("/books")
      }
      this.clear()
    } catch (err) {
      runInAction(
        () =>
          (this.error = {
            message: err.message,
            visible: true,
          })
      )
    }
    runInAction(() => (this.pending = false))
  }

  @action.bound
  public clear() {
    this.data = this.parentStore.query
    this.error = {
      message: "",
      visible: false,
    }
  }
}
