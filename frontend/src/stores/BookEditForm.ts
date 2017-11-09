import Form from "stores/Form"
import { toJS, action, runInAction } from "mobx"
import history from "utils/history"

export default class BookEditForm extends Form<IBookStore, IBook>
  implements IBookEditForm {
  public async sendRequest() {
    try {
      runInAction(() => this.pending = true)
      const book = await this.parentStore.saveBook(toJS(this.data))
      history.push(`/books/${book.id}/view`)
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
    this.data = {
      id: undefined,
      title: '',
      author: '',
      publication_year: new Date().getFullYear(),
      publication_place: '',
      publishing_house: '',
      count: 0,
    }
    this.error = {
      message: "",
      visible: false,
    }
  }
}
