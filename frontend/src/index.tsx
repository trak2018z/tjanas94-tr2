import "babel-polyfill"
import React from "react"
import { render } from "react-dom"
import { Provider } from "mobx-react"
import { useStrict } from "mobx"
import { AppContainer } from "react-hot-loader"
import RedBox from "redbox-react"

import "styles"
import logger from "utils/logger"
import config from "config"
import App from "components/App/App"
import stores from "stores"

useStrict(true)
const appElement = document.getElementById("app")

function renderApp() {
  try {
    render(
      <AppContainer>
        <Provider {...stores}>
            <App />
        </Provider>
      </AppContainer>,
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
  module.hot.accept("components/App/App", renderApp)
}
