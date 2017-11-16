import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import Notification from "components/Notification"

interface IBookSearchProps {
  bookSearchForm?: IBookSearchStore
}

@inject("bookSearchForm")
@observer
export default class BookSearch extends Component<IBookSearchProps, {}> {
  public componentDidMount() {
    this.props.bookSearchForm!.clear()
  }

  public render() {
    const bookSearchForm = this.props.bookSearchForm!
    return (
      <div className="box">
        <form action="#" onSubmit={bookSearchForm.submit}>
          <Notification message={bookSearchForm.error} />
          <div className="field">
            <label className="label">Tytuł</label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={bookSearchForm.data.title}
                onChange={bookSearchForm.updateField("title")}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Autor</label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={bookSearchForm.data.author}
                onChange={bookSearchForm.updateField("author")}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Rok wydania</label>
          </div>
          <div className="field is-grouped">
            <div className="control">
              <input
                className="input"
                type="number"
                value={bookSearchForm.data.publication_year__gte}
                onChange={bookSearchForm.updateField("publication_year__gte")}
              />
            </div>
            <div className="control">
            &mdash;
            </div>
            <div className="control">
              <input
                className="input"
                type="number"
                value={bookSearchForm.data.publication_year__lte}
                onChange={bookSearchForm.updateField("publication_year__lte")}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Dostępność</label>
            <div className="control">
              <div className="select">
                <select
                  value={bookSearchForm.data.available}
                  onChange={bookSearchForm.updateField("available")}
                >
                  <option value="">Wszystkie</option>
                  <option value="true">Dostępne</option>
                  <option value="false">Niedostępne</option>
                </select>
              </div>
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button
                className="button is-link is-fullwidth is-size-4"
                disabled={bookSearchForm.pending}
              >
                Szukaj
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}
