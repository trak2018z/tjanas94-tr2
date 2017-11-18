import FormStore from "stores/FormStore"
import { toJS, action, runInAction } from "mobx"
import history from "utils/history"

export default class BookEditStore extends FormStore<IBookStore, IBook>
  implements IBookEditStore {
  public async sendRequest() {
    const book = await this.parentStore.saveBook(toJS(this.data))
    this.rootStore.messageStore.showMessage("Zapisano książkę")
    history.push(`/books/${book.id}/view`)
  }

  @action.bound
  public clear() {
    this.data = {
      id: undefined,
      title: "",
      author: "",
      publication_year: new Date().getFullYear(),
      publication_place: "",
      publishing_house: "",
      count: 0,
    }
    this.error = {
      message: "",
      visible: false,
    }
    this.pending = false
  }

  public async fetchBook(id?: number) {
    this.clear()
    if (!id) {
      return
    }
    await this.parentStore.getBook(id)
    if (this.parentStore.book) {
      runInAction(() => (this.data = this.copyData(toJS(this.parentStore.book!))))
    }
  }

  private copyData(data: IBook) {
    return {
      id: data.id,
      title: data.title || "",
      author: data.author || "",
      publication_yeay: data.publication_year || "",
      publication_place: data.publication_place || "",
      publishing_house: data.publishing_house || "",
      count: data.count || 0,
    }
  }
}
