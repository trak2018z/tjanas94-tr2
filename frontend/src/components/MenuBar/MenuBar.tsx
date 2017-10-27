import React from "react"
import { observer, inject } from "mobx-react"

import styles from "./style"

interface IMenuBarProps {
  userStore?: IUserStore
}

const MenuBar = ({ userStore }: IMenuBarProps) => (
  <nav className={`navbar ${styles.darkBackground}`}>
    <div className="container">
      <div className="navbar-brand">
        <a className="navbar-item is-size-4" href="/">
          Biblioteka
        </a>
      </div>
      <div id="navbarMenu" className="navbar-menu">
        <div className="navbar-end">
          <a className="navbar-item">Ksiązki</a>
          <a className="navbar-item">Wypożyczenia</a>
          {userStore!.user.admin && (
            <a className="navbar-item" href="/admin">
              <i className="icon fa fa-cog" />
              Panel admina
            </a>
          )}
          {userStore!.user.authenticated && (
            <a className="navbar-item">
              <i className="icon fa fa-user" />
              {userStore!.user.firstname} {userStore!.user.lastname}
            </a>
          )}
          {userStore!.user.authenticated && (
            <a className="navbar-item" onClick={userStore!.logout.bind(userStore)}>
              <i className="icon fa fa-sign-out" />
              Wyloguj
            </a>
          )}
          {!userStore!.user.authenticated && (
            <a className="navbar-item">
              <i className="icon fa fa-sign-in" />
              Zaloguj się
            </a>
          )}
        </div>
      </div>
    </div>
  </nav>
)

export default inject("userStore")(observer(MenuBar))
