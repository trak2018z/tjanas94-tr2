import React, { Component } from "react"
import { Link } from "react-router-dom"
import { toJS, runInAction } from "mobx"
import { observer, inject } from "mobx-react"
import Notification from "components/Notification"

interface IBooksEditProps {
  bookEditForm?: IBookEditForm
  match?: any
}

@inject("bookEditForm")
@observer
export default class BooksEdit extends Component<IBooksEditProps, {}> {
  public componentDidMount() {
    this.fetchBook(this.props.match.params.id)
  }

  public componentWillReceiveProps(nextProps: IBooksEditProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.fetchBook(nextProps.match.params.id)
    }
  }

  public render() {
    const bookEditForm = this.props.bookEditForm!
    return (
      <div className="box">
        <form action="#" onSubmit={bookEditForm.submit}>
          <Notification message={bookEditForm.error} />
          <div className="field">
            <label className="label">Tytuł</label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={bookEditForm.data.title}
                onChange={bookEditForm.updateField("title")}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Autor</label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={bookEditForm.data.author}
                onChange={bookEditForm.updateField("author")}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Rok wydania</label>
            <div className="control">
              <input
                className="input"
                type="number"
                value={bookEditForm.data.publication_year}
                onChange={bookEditForm.updateField("publication_year")}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Miejsce wydania</label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={bookEditForm.data.publication_place}
                onChange={bookEditForm.updateField("publication_place")}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Wydawnictwo</label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={bookEditForm.data.publishing_house}
                onChange={bookEditForm.updateField("publishing_house")}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Ilość</label>
            <div className="control">
              <input
                className="input"
                type="number"
                value={bookEditForm.data.count}
                onChange={bookEditForm.updateField("count")}
              />
            </div>
          </div>
          <div className="field is-grouped">
            <div className="control">
              <button
                className="button is-link"
                disabled={bookEditForm.pending}
              >
                Zapisz
              </button>
            </div>
            {bookEditForm.data.id && (
              <div className="control">
                <Link
                  className="button"
                  to={`/books/${bookEditForm.data.id}/view`}
                >
                  Anuluj
                </Link>
              </div>
            )}
          </div>
        </form>
      </div>
    )
  }

  private async fetchBook(id: number) {
    this.props.bookEditForm!.clear()
    if (!id) {
      return
    }
    const bookStore = this.props.bookEditForm!.parentStore
    await bookStore.getBook(id)
    if (bookStore.book) {
      runInAction(() => (this.props.bookEditForm!.data = toJS(bookStore.book!)))
    }
  }
}
