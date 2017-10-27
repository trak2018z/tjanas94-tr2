import Store from "stores/Store"

export default abstract class ChildStore<T extends IStore> extends Store
  implements IChildStore<T> {
  constructor(public rootStore: IRootStore, public parentStore: T) {
    super()
  }
}
