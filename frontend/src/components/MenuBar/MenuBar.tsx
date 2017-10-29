import React from "react"
import { Link } from "react-router-dom"
import { observer, inject } from "mobx-react"

import styles from "./style"

interface IMenuBarProps {
  userStore?: IUserStore
}

const MenuBar = ({ userStore }: IMenuBarProps) => (
  <nav className={`navbar ${styles.darkBackground}`}>
    <div className="container">
      <div className="navbar-brand">
        <Link to="/" className="navbar-item is-size-4" href="/">
          Biblioteka
        </Link>
      </div>
      <div id="navbarMenu" className="navbar-menu">
        <div className="navbar-end">
          <Link to="/books" className="navbar-item">
            Książki
          </Link>
          {userStore!.hasPermision(
            ["books.view_own_lendings", "books.view_all_lendings"]
          ) && (
            <Link to="/lendings" className="navbar-item">
              Wypożyczenia
            </Link>
          )}
          {userStore!.user.admin && (
            <a className="navbar-item" href="/admin">
              <i className="icon fa fa-cog" />
              Panel admina
            </a>
          )}
          {userStore!.user.authenticated && (
            <Link to="/profile" className="navbar-item">
              <i className="icon fa fa-user" />
              {userStore!.user.firstname} {userStore!.user.lastname}
            </Link>
          )}
          {userStore!.user.authenticated && (
            <a className="navbar-item" onClick={userStore!.logout}>
              <i className="icon fa fa-sign-out" />
              Wyloguj
            </a>
          )}
          {!userStore!.user.authenticated && (
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

export default inject("userStore")(observer(MenuBar))
