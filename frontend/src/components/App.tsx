import React, { Component } from "react"
import { Route, Router, Switch, Redirect } from "react-router-dom"
import { observer } from "mobx-react"
import DevTools from "mobx-react-devtools"

import history from "utils/history"
import MenuBar from "components/MenuBar"
import Landing from "components/Landing"
import GlobalNotification from "components/GlobalNotification"
import AuthRoute from "components/AuthRoute"

import {
  LoginForm,
  RegisterForm,
  ProfileView,
  ProfileForm,
  ResetPasswordStep1,
  ResetPasswordStep2,
} from "routes/accounts"
import { BookList, BookSearch } from "routes/books"
import { LendingList } from "routes/lendings"

import styles from "./style"


@observer
export default class App extends Component<{}, {}> {
  public render() {
    return (
      <Router history={history}>
        <section className={`hero is-fullheight is-link ${styles.paddingTop}`}>
          <div className={`hero-head ${styles.stickyHead}`}>
            <MenuBar />
            <GlobalNotification />
          </div>
          <div className={`hero-body ${styles.hero}`}>
            <Switch>
              <Route exact={true} path="/" component={Landing(BookSearch)} />
              <Route
                exact={true}
                path="/login"
                component={Landing(LoginForm)}
              />
              <Route
                exact={true}
                path="/register"
                component={Landing(RegisterForm)}
              />
              <Route
                exact={true}
                path="/reset_password"
                component={Landing(ResetPasswordStep1)}
              />
              <Route
                exact={true}
                path="/reset_password/:token"
                component={Landing(ResetPasswordStep2)}
              />
              <Route path="/books" component={BookList} />
              <AuthRoute
                permissions={[
                  "books.view_own_lendings",
                  "books.view_all_lendings",
                ]}
                path="/lendings"
                component={LendingList}
              />
              <AuthRoute
                exact={true}
                path="/profile"
                component={Landing(ProfileView)}
              />
              <AuthRoute
                exact={true}
                path="/profile/edit"
                component={Landing(ProfileForm)}
              />
              <Redirect to="/" />
            </Switch>
          </div>

          <div className="hero-foot">
            <div className="tabs is-right is-small">
              <div className="container">
                <ul>
                  <li>
                    <a href="#">Wykonanie: Tomasz Janas &copy; 2017</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {process.env.DEBUG && <DevTools />}
        </section>
      </Router>
    )
  }
}
