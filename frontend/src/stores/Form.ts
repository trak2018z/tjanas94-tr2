import ChildStore from "stores/ChildStore"
import { action, observable } from "mobx"
import moment from "moment"

export default abstract class Form<T extends IStore, U> extends ChildStore<T>
  implements IForm<T, U> {
  @observable public data: U
  @observable public pending = false
  @observable public error: IMessage

  constructor(rootStore: IRootStore, parentStore: T) {
    super(rootStore, parentStore)
    this.clear()
  }

  public updateField(field: keyof U) {
    return action((event: any) => this.data[field] = event.target.value)
  }

  public updateTimestamp(field: keyof U) {
    return action((event: any) => {
      const anyData: any = this.data
      const date = moment(event.target.value, 'YYYY-MM-DD', true)
      anyData[field] = date.isValid() ? date.unix() : undefined
    })
  }

  public submit = (event: any) => {
    event.preventDefault()
    this.sendRequest()
  }

  public abstract clear(): void
  public abstract sendRequest(): Promise<void>
}
