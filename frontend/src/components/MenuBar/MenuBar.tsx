import React from "react"

import styles from "./style"

const MenuBar = () => (
  <nav className={`navbar ${styles.transparent} ${styles.darkBackground}`}>
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
          <a className="navbar-item" href="/admin">
            <i className="icon fa fa-cog" />
            Panel admina
          </a>
          <a className="navbar-item">
            <i className="icon fa fa-user" />
            Zarejestruj się
          </a>
          <a className="navbar-item">
            <i className="icon fa fa-sign-in" />
            Zaloguj się
          </a>
          <a className="navbar-item">
            <i className="icon fa fa-user" />
            Tomasz Janas
          </a>
          <a className="navbar-item">
            <i className="icon fa fa-sign-out" />
            Wyloguj
          </a>
        </div>
      </div>
    </div>
  </nav>
)

export default MenuBar
