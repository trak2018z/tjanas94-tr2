import "babel-polyfill"
import React from "react"
import { render } from "react-dom"
import { Provider } from "mobx-react"
import { AppContainer } from "react-hot-loader"

import "styles"
import App from "components/App"
import stores from "stores"
import config from "config"

function renderApp() {
  render(
    <AppContainer>
      <Provider {...stores} config={config}>
        <App />
      </Provider>
    </AppContainer>,
    document.getElementById("app")
  )
}

renderApp()

if (module.hot) {
  module.hot.accept("components/App", renderApp)
}
