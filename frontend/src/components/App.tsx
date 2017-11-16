import React, { Component } from "react"
import { Route, Router } from "react-router-dom"
import { observer, inject } from "mobx-react"
import DevTools from "mobx-react-devtools"

import config from "config"
import history from "utils/history"
import MenuBar from "components/MenuBar"
import Landing from "components/Landing"
import GlobalNotification from "components/GlobalNotification"

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

interface IAppProps {
  userStore?: IUserStore
}

@inject("userStore")
@observer
export default class App extends Component<IAppProps, {}> {
  public render() {
    const userStore = this.props.userStore!
    return (
      <Router history={history}>
        <section className={`hero is-fullheight is-link ${styles.paddingTop}`}>
          <div className={`hero-head ${styles.stickyHead}`}>
            <MenuBar />
            <GlobalNotification />
          </div>
          <div className={`hero-body ${styles.hero}`}>
            <Route exact={true} path="/" component={Landing(BookSearch)} />
            <Route path="/login" component={Landing(LoginForm)} />
            <Route path="/register" component={Landing(RegisterForm)} />
            <Route exact={true} path="/reset_password" component={Landing(ResetPasswordStep1)} />
            <Route path="/reset_password/:token" component={Landing(ResetPasswordStep2)} />
            <Route path="/books" component={BookList} />
            {userStore.hasPermision(
              "books.view_own_lendings",
              "books.view_all_lendings"
            ) && <Route path="/lendings" component={LendingList} />}
            {userStore.user.authenticated && (
              <Route exact={true} path="/profile" component={Landing(ProfileView)} />
            )}
            {userStore.user.authenticated && (
              <Route path="/profile/edit" component={Landing(ProfileForm)} />
            )}
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
          {config.debug && <DevTools />}
        </section>
      </Router>
    )
  }
}
