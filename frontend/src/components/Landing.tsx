import React from "react"
import { observer } from "mobx-react"

const Landing = (Form: any) => observer(() => (
  <div className="container">
    <div className="columns">
      <div className="column is-6 has-text-centered">
        <h1 className="title is-2">Witamy w bibliotece!</h1>
        <h2 className="subtitle is-4">
          Projekt wykonany w ramach przedmiotu Aplikacje internetowe.
        </h2>
      </div>
      <div className="column is-5 is-offset-1">
        <Form />
      </div>
    </div>
  </div>
))

export default Landing
