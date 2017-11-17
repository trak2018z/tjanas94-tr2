import React, { Component } from "react"
import { Link } from "react-router-dom"
import { observer, inject } from "mobx-react"

import styles from "./style"

interface IMenuBarProps {
  userStore?: IUserStore
}

interface IMenuBarState {
  active: boolean
}

@inject("userStore")
@observer
export default class MenuBar extends Component<IMenuBarProps, IMenuBarState> {
  public state: IMenuBarState = {
    active: false,
  }

  public toggleMenu = () => this.setState({ active: !this.state.active })
  public closeMenu = () => this.setState({ active: false })

  public render() {
    const userStore = this.props.userStore!
    return (
      <nav className={`navbar ${styles.darkBackground}`}>
        <div className="container">
          <div className="navbar-brand">
            <Link to="/" className="navbar-item is-size-4" href="/">
              Biblioteka
            </Link>
            <button
              className={`button navbar-burger ${styles.lightButton}`}
              onClick={this.toggleMenu}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
          <div
            id="navbarMenu"
            className={`navbar-menu ${this.state.active ? "is-active" : ""}`}
            onClick={this.closeMenu}
          >
            <div className="navbar-end">
              <Link to="/books" className="navbar-item">
                Książki
              </Link>
              {userStore.hasPermision(
                "books.view_own_lendings",
                "books.view_all_lendings"
              ) && (
                <Link to="/lendings" className="navbar-item">
                  Wypożyczenia
                </Link>
              )}
              {userStore.user.admin && (
                <a className="navbar-item" href="/admin">
                  <i className="icon fa fa-cog" />
                  Panel admina
                </a>
              )}
              {userStore.user.authenticated && (
                <Link to="/profile" className="navbar-item">
                  <i className="icon fa fa-user" />
                  {userStore.user.first_name} {userStore.user.last_name}
                </Link>
              )}
              {userStore.user.authenticated && (
                <a className="navbar-item" onClick={userStore.logout}>
                  <i className="icon fa fa-sign-out" />
                  Wyloguj
                </a>
              )}
              {!userStore.user.authenticated && (
                <Link to="/login" className="navbar-item">
                  <i className="icon fa fa-sign-in" />
                  Zaloguj się
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    )
  }
}
