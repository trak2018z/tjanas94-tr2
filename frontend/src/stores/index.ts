import RootStore from "stores/RootStore"

const store = (window.store = new RootStore().getStoreMap())

export default store
