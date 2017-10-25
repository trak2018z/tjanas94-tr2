import React, { Component } from "react"
import DevTools from "mobx-react-devtools"

import MenuBar from "components/MenuBar/MenuBar"
import Landing from "routes/landing/Landing"

export default class App extends Component<{}, {}> {
  public render() {
    return (
      <section className="hero is-fullheight is-info">
        <div className="hero-head">
          <MenuBar />
        </div>
        <div className="hero-body">
          <Landing />
        </div>

        <div className="hero-foot">
          <div className="tabs is-right is-small">
            <div className="container">
              <ul>
                <li>
                  <a>Wykonanie: Tomasz Janas &copy; 2017</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <DevTools />
      </section>
    )
  }
}
