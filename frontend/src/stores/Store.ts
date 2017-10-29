export default abstract class Store implements IStore {
  public getChildStores() {
    const anyThis = this as any
    return Object.keys(this)
      .filter(
        key =>
          anyThis[key] && anyThis[key].getChildStores != null &&
          !["rootStore", "parentStore"].includes(key)
      )
      .reduce(
        (result, key) =>
          Object.assign(
            result,
            { [key]: anyThis[key] },
            anyThis[key].getChildStores()
          ),
        {} as any
      )
  }
}
