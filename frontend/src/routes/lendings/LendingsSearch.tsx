import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import Notification from "components/Notification"
import moment from "moment"

interface ILendingsSearchProps {
  lendingSearchForm?: ILendingSearchForm
  lendingStore?: ILendingStore
  userStore?: IUserStore
}

@inject("lendingSearchForm", "lendingStore", "userStore")
@observer
export default class LendingsSearch extends Component<
  ILendingsSearchProps,
  {}
> {
  public componentDidMount() {
    this.props.lendingSearchForm!.clear()
  }

  public render() {
    const lendingSearchForm = this.props.lendingSearchForm!
    const lendingStore = this.props.lendingStore!
    const userStore = this.props.userStore!
    const currentDate = moment().format("YYYY-MM-DD")
    return (
      <div className="box">
        <form action="#" onSubmit={lendingSearchForm.submit}>
          <Notification message={lendingSearchForm.error} />
          {userStore!.hasPermision("books.view_all_lendings") && (
            <div className="field">
              <label className="label">Email czytelnika</label>
              <div className="control">
                <input
                  className="input"
                  type="email"
                  value={lendingSearchForm.data.user}
                  onChange={lendingSearchForm.updateField("user")}
                />
              </div>
            </div>
          )}
          <div className="field">
            <label className="label">Data rezerwacji</label>
          </div>
          <div className="field is-grouped">
            <div className="control">
              <input
                className="input"
                type="text"
                value={lendingSearchForm.data.created__gte}
                placeholder={currentDate}
                onChange={lendingSearchForm.updateField("created__gte")}
              />
            </div>
            <div className="control">&mdash;</div>
            <div className="control">
              <input
                className="input"
                type="text"
                value={lendingSearchForm.data.created__lte}
                placeholder={currentDate}
                onChange={lendingSearchForm.updateField("created__lte")}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Status</label>
            <div className="control">
              <div className="select">
                <select
                  value={lendingSearchForm.data.status}
                  onChange={lendingSearchForm.updateField("status")}
                >
                  <option value="">Wszystkie</option>
                  {Object.entries(
                    lendingStore.lendingStatuses
                  ).map(([value, name]) => (
                    <option key={value} value={value}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button
                className="button is-link is-fullwidth is-size-4"
                disabled={lendingSearchForm.pending}
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
