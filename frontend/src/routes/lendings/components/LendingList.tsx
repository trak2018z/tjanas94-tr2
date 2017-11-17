import React, { Component } from "react"
import { Route, Link, Switch, Redirect } from "react-router-dom"
import { observer, inject } from "mobx-react"
import styles from "components/style"
import LendingSearch from "./LendingSearch"
import Paginator from "components/Paginator"
import EmptyCard from "components/EmptyCard"
import LendingView from "./LendingView"
import moment from "moment"

interface ILendingListProps {
  userStore?: IUserStore
  lendingStore?: ILendingStore
}

@inject("lendingStore", "userStore")
@observer
export default class LendingList extends Component<ILendingListProps, {}> {
  public componentDidMount() {
    this.props.lendingStore!.fetchLendings()
  }

  public render() {
    const userStore = this.props.userStore!
    const lendingStore = this.props.lendingStore!
    return (
      <div className="container">
        <div className="columns">
          <div className="column is-6">
            <Paginator
              page={lendingStore.page}
              changePage={lendingStore.changePage}
            />
            {lendingStore.lendings.length ? (
              lendingStore.lendings.map(lending => (
                <LendingCard
                  key={lending.id}
                  lending={lending}
                  lendingStore={lendingStore}
                  userStore={userStore}
                />
              ))
            ) : (
              <EmptyCard />
            )}
          </div>
          <div className="column is-5 is-offset-1-desktop" id="lendingView">
            <Switch>
              <Route exact={true} path="/lendings" />
              <Route
                exact={true}
                path="/lendings/:id/view"
                component={LendingView}
              />
              <Redirect to="/lendings" />
            </Switch>
            <LendingSearch />
          </div>
        </div>
      </div>
    )
  }
}

interface ILendingCardProps {
  lending: ILending
  lendingStore: ILendingStore
  userStore: IUserStore
}

const LendingCard = observer(
  ({ lending, lendingStore, userStore }: ILendingCardProps) => (
    <div className={`card ${styles.card}`}>
      <div className="card-content">
        <p className="is-size-4">{lending.book.title}</p>
        {userStore.hasPermision("books.view_all_lendings") && (
          <p>
            Utworzone przez: {lending.history[0].user.first_name}{" "}
            {lending.history[0].user.last_name} ({lending.history[0].user.email})
          </p>
        )}
        <p>
          Status: {lendingStore.lendingStatuses[lending.last_change.status]}
        </p>
        <p>
          Ostatnia aktualizacja:{" "}
          {moment(lending.last_change.created).format("YYYY-MM-DD HH:mm")}
        </p>
        <div className="field is-grouped is-grouped-right is-grouped-multiline">
          <div className="control">
            <Link
              className="button is-link"
              to={`/lendings/${lending.id}/view`}
            >
              Więcej informacji
            </Link>
          </div>
          {userStore.hasPermision("books.view_all_lendings") &&
            lending.last_change.status === 1 && (
              <div className="control">
                <div className="control">
                  <button
                    className="button is-warning"
                    onClick={lendingStore.updateLending(lending.id, 2)}
                  >
                    Wypożycz
                  </button>
                </div>
              </div>
            )}
          {userStore.hasPermision("books.view_all_lendings") &&
            lending.last_change.status === 2 && (
              <div className="control">
                <div className="control">
                  <button
                    className="button is-warning"
                    onClick={lendingStore.updateLending(lending.id, 3)}
                  >
                    Przedłuż wypożyczenie
                  </button>
                </div>
              </div>
            )}
          {userStore.hasPermision("books.view_all_lendings") &&
            [2, 3].includes(lending.last_change.status) && (
              <div className="control">
                <div className="control">
                  <button
                    className="button is-warning"
                    onClick={lendingStore.updateLending(lending.id, 4)}
                  >
                    Odbierz zwrot
                  </button>
                </div>
              </div>
            )}
          {lending.last_change.status === 1 && (
            <div className="control">
              <button
                className="button is-danger"
                onClick={lendingStore.updateLending(lending.id, 5)}
              >
                Anuluj
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
)
