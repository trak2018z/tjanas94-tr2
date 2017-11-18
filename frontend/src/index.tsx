import "babel-polyfill"
import "utils/setup"
import "styles"
import React from "react"
import { render } from "react-dom"
import { Provider } from "mobx-react"
import { useStrict } from "mobx"
import RedBox from "redbox-react"

import logger from "utils/logger"
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
    if (process.env.DEBUG) {
      render(<RedBox error={err} />, appElement)
    }
  }
}

renderApp()

if (module.hot) {
  module.hot.accept("components/App", renderApp)
}

if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
}
