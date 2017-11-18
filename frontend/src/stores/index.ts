import RootStore from "stores/RootStore"

const store = new RootStore().getStoreMap()
if (process.env.DEBUG) {
  window.store = store
}

export default store

if (module.hot) {
  module.hot.accept()
}
