export default abstract class Store implements IStore {
  public getChildStores() {
    const anyThis = this as any
    return this.getOwnChildStores().reduce(
      (result, key) =>
        Object.assign(
          result,
          { [key]: anyThis[key] },
          anyThis[key].getChildStores()
        ),
      {} as any
    )
  }

  public clearChildStores() {
    const anyThis = this as any
    return this.getOwnChildStores().forEach(key => anyThis[key].clear())
  }

  public abstract clear(): void

  private getOwnChildStores() {
    const anyThis = this as any
    return Object.keys(this).filter(
      key =>
        anyThis[key] &&
        anyThis[key].getChildStores != null &&
        !["rootStore", "parentStore"].includes(key)
    )
  }
}
