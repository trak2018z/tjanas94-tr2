import "babel-polyfill"
import React from "react"
import { render } from "react-dom"

import "styles"
import App from "components/App"

render(<App />, document.getElementById("app"))

if (module.hot) {
  module.hot.accept()
}
