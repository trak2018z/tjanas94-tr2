import React, { Component } from "react"
import { Route, Router } from "react-router-dom"
import DevTools from "mobx-react-devtools"
import { observer } from "mobx-react"

import config from "config"
import history from "utils/history"
import MenuBar from "components/MenuBar/MenuBar"
import Landing from "components/Landing"
import GlobalNotification from "components/GlobalNotification"

import Login from "routes/login/Login"
import Register from "routes/register/Register"

@observer
export default class App extends Component<{}, {}> {
  public render() {
    return (
      <Router history={history}>
        <section className="hero is-fullheight is-link">
          <div className="hero-head">
            <MenuBar />
            <GlobalNotification />
          </div>
          <div className="hero-body">
            <Route exact={true} path="/" component={Landing(Login)} />
            <Route path="/login" component={Landing(Login)} />
            <Route path="/register" component={Landing(Register)} />
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
