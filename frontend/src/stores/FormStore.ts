import ChildStore from "stores/ChildStore"
import { action, observable, runInAction } from "mobx"
import moment from "moment"

export default abstract class FormStore<T extends IStore, U> extends ChildStore<
  T
> implements IFormStore<T, U> {
  @observable public data: U
  @observable public pending: boolean
  @observable public error: IMessage

  public updateField(field: keyof U) {
    return action(
      (event: any) =>
        (this.data[field] =
          event.target.type === "checkbox"
            ? event.target.checked
            : event.target.value)
    )
  }

  public updateTimestamp(field: keyof U) {
    return action((event: any) => {
      const anyData: any = this.data
      const date = moment(event.target.value, "YYYY-MM-DD", true)
      anyData[field] = date.isValid() ? date.unix() : undefined
    })
  }

  public submit = async (event: any) => {
    event.preventDefault()
    try {
      runInAction(() => (this.pending = true))
      await this.sendRequest()
    } catch (err) {
      runInAction(
        () =>
          (this.error = {
            message: err.message,
            visible: true,
          })
      )
    }
    runInAction(() => (this.pending = false))
  }

  public abstract sendRequest(): Promise<void>
}
