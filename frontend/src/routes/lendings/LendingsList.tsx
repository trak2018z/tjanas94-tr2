import React from "react"
import { Route, Link } from "react-router-dom"
import { observer, inject } from "mobx-react"
import styles from "components/style"
import LendingsSearch from "./LendingsSearch"
import Paginator from "components/Paginator"
import EmptyCard from "components/EmptyCard"
import LendingsView from "./LendingsView"
import moment from "moment"

interface ILendingsListProps {
  userStore?: IUserStore
  lendingStore?: ILendingStore
}

const LendingsList = ({ lendingStore, userStore }: ILendingsListProps) => (
  <div className="container">
    <div className="columns">
      <div className="column is-6">
        <Paginator
          page={lendingStore!.page}
          changePage={lendingStore!.changePage}
        />
        {lendingStore!.lendings.length ? (
          lendingStore!.lendings.map(lending => (
            <LendingCard
              key={lending.id}
              lending={lending}
              lendingStore={lendingStore!}
              userStore={userStore!}
            />
          ))
        ) : (
          <EmptyCard />
        )}
      </div>
      <div className="column is-5 is-offset-1">
        <Route path="/lendings/:id/view" component={LendingsView} />
        <LendingsSearch />
      </div>
    </div>
  </div>
)

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
        {userStore!.hasPermision("books.view_all_lendings") && (
          <p>
            Utworzone przez: {lending.history[0].user.first_name} {lending.history[0].user.last_name} ({lending.history[0].user.email})
          </p>
        )}
        <p>Status: {lendingStore.lendingStatuses[lending.last_change.status]}</p>
        <p>
          Ostatnia aktualizacja:{" "}
          {moment(lending.last_change.created).format("YYYY-MM-DD HH:mm")}
        </p>
        <div className="field is-grouped is-grouped-right">
          <div className="control">
            <Link
              className="button is-link"
              to={`/lendings/${lending.id}/view`}
            >
              Więcej informacji
            </Link>
          </div>
          {userStore!.hasPermision("books.view_all_lendings") &&
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
          {userStore!.hasPermision("books.view_all_lendings") &&
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
          {userStore!.hasPermision("books.view_all_lendings") &&
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

export default inject("lendingStore", "userStore")(observer(LendingsList))
