import "babel-polyfill"
import React from "react"
import { render } from "react-dom"
import { Provider } from "mobx-react"
import { useStrict } from "mobx"
import RedBox from "redbox-react"

import "styles"
import logger from "utils/logger"
import config from "config"
import stores from "stores"
import App from "components/App"

useStrict(true)
const appElement = document.getElementById("app")

function renderApp() {
  try {
    render(
      <Provider {...stores}>
        <App />
      </Provider>,
      appElement
    )
  } catch (err) {
    logger.error(err)
    if (config.debug) {
      render(<RedBox error={err} />, appElement)
    }
  }
}

renderApp()

if (module.hot) {
  module.hot.accept("components/App", renderApp)
}
