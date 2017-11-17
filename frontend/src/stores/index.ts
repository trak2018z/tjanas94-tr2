import RootStore from "stores/RootStore"
import config from "config"

const store = new RootStore().getStoreMap()
if (config.debug) {
  window.store = store
}

export default store

if (module.hot) {
  module.hot.accept()
}
