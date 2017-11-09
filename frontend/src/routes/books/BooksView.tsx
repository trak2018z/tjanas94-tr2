import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import moment from "moment"

interface IBooksViewProps {
  bookStore?: IBookStore
  match?: any
}

@inject("bookStore")
@observer
export default class BooksView extends Component<IBooksViewProps, {}> {
  public componentDidMount() {
    this.props.bookStore!.getBook(this.props.match.params.id)
  }

  public componentWillReceiveProps(nextProps: IBooksViewProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.props.bookStore!.getBook(nextProps.match.params.id)
    }
  }

  public render() {
    const bookStore = this.props.bookStore!
    const book = bookStore.book
    if (book) {
      return (
        <div className="box">
          <div className="field">
            <label className="label">Tytuł</label>
            <div className="control">{book.title}</div>
          </div>
          {book.author && (
            <div className="field">
              <label className="label">Autor</label>
              <div className="control">{book.author}</div>
            </div>
          )}
          {book.publication_year && (
            <div className="field">
              <label className="label">Rok wydania</label>
              <div className="control">{book.publication_year}</div>
            </div>
          )}
          {book.publication_place && (
            <div className="field">
              <label className="label">Miejsce wydania</label>
              <div className="control">{book.publication_place}</div>
            </div>
          )}
          {book.publishing_house && (
            <div className="field">
              <label className="label">Wydawnictwo</label>
              <div className="control">{book.publishing_house}</div>
            </div>
          )}
          <div className="field">
            <label className="label">Dostępność</label>
            <div className="control">
              {book.available ? "Dostępne" : "Niedostępne"}
            </div>
          </div>
          <div className="field">
            <label className="label">Dodano</label>
            <div className="control">{moment(book.created).format('YYYY-MM-DD HH:mm')}</div>
          </div>
          <div className="field">
            <label className="label">Ostatnia aktualizacja</label>
            <div className="control">{moment(book.modified).format('YYYY-MM-DD HH:mm')}</div>
          </div>
        </div>
      )
    }
    return null
  }
}
