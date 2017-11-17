import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import moment from "moment"
import scroll from "utils/scroll"

interface ILendingViewProps {
  lendingStore?: ILendingStore
  userStore?: IUserStore
  match?: any
}

@inject("lendingStore", "userStore")
@observer
export default class LendingView extends Component<ILendingViewProps, {}> {
  public componentDidMount() {
    this.props.lendingStore!.getLending(this.props.match.params.id)
    scroll(document.getElementById('lendingView')!)
  }

  public componentWillReceiveProps(nextProps: ILendingViewProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.props.lendingStore!.getLending(nextProps.match.params.id)
      scroll(document.getElementById('lendingView')!)
    }
  }

  public render() {
    const lendingStore = this.props.lendingStore!
    const userStore = this.props.userStore!
    const lending = lendingStore.lending
    if (lending) {
      return (
        <div className="box">
          <div className="field">
            <label className="label">Tytuł książki</label>
            <div className="control">{lending.book.title}</div>
          </div>
          <div className="field">
            <label className="label">Historia zmian</label>
            <div className="content">
              <ul>
                {lending.history.reverse().map(h => (
                  <li key={h.id}>
                    <p>
                      <b>Data modyfikacji:</b>{" "}
                      {moment(h.created).format("YYYY-MM-DD HH:mm")}
                    </p>
                    <p>
                      <b>Status:</b> {lendingStore.lendingStatuses[h.status]}
                    </p>
                    {userStore!.hasPermision("books.view_all_lendings") && (
                      <p>
                        <b>Zmodyfikowane przez:</b> {h.user.first_name}
                        {h.user.last_name} ({h.user.email})
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )
    }
    return null
  }
}
