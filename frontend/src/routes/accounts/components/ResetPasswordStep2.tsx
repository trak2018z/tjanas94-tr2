import React, { Component } from "react"
import { runInAction } from "mobx"
import { observer, inject } from "mobx-react"
import Notification from "components/Notification"

interface IResetPasswordStep2Props {
  resetPasswordStep2Form?: IResetPasswordStep2Store
  match?: any
}

@inject("resetPasswordStep2Form")
@observer
export default class ResetPasswordStep2 extends Component<
  IResetPasswordStep2Props,
  {}
> {
  public componentDidMount() {
    this.props.resetPasswordStep2Form!.clear()
    const token = this.props.match.params.token
    runInAction(() => (this.props.resetPasswordStep2Form!.data.token = token))
  }

  public render() {
    const resetPasswordStep2Form = this.props.resetPasswordStep2Form!
    return (
      <div className="box">
        <form action="#" onSubmit={resetPasswordStep2Form.submit}>
          <Notification message={resetPasswordStep2Form.error} />
          <div className="field">
            <label className="label">Nowe hasło</label>
            <div className="control has-icons-left">
              <input
                className={`input ${resetPasswordStep2Form.validation
                  .password && "is-danger"}`}
                type="password"
                required={true}
                value={resetPasswordStep2Form.data.password}
                onBlur={resetPasswordStep2Form.validatePassword}
                onChange={resetPasswordStep2Form.updateField("password")}
              />
              <span className="icon is-small is-left">
                <i className="fa fa-lock" />
              </span>
            </div>
            {resetPasswordStep2Form.validation.password && (
              <p className="help is-danger">
                {resetPasswordStep2Form.validation.password}
              </p>
            )}
          </div>
          <div className="field">
            <label className="label">Powtórz hasło</label>
            <div className="control has-icons-left">
              <input
                className={`input ${resetPasswordStep2Form.validation
                  .confirmPassword && "is-danger"}`}
                type="password"
                required={true}
                value={resetPasswordStep2Form.data.confirmPassword}
                onBlur={resetPasswordStep2Form.validatePassword}
                onChange={resetPasswordStep2Form.updateField("confirmPassword")}
              />
              <span className="icon is-small is-left">
                <i className="fa fa-lock" />
              </span>
            </div>
            {resetPasswordStep2Form.validation.confirmPassword && (
              <p className="help is-danger">
                {resetPasswordStep2Form.validation.confirmPassword}
              </p>
            )}
          </div>
          <div className="field">
            <div className="control">
              <button
                className="button is-link is-fullwidth is-size-4"
                disabled={resetPasswordStep2Form.pending}
              >
                Zapisz
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}
