import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { runInAction } from "mobx"
import Notification from "components/Notification"
import renderCaptcha from "utils/recaptcha"

interface IResetPasswordStep1Props {
  resetPasswordStep1Form?: IResetPasswordStep1Store
}

@inject("resetPasswordStep1Form")
@observer
export default class ResetPasswordStep1 extends Component<IResetPasswordStep1Props, {}> {
  public async componentDidMount() {
    this.props.resetPasswordStep1Form!.clear()
    const captchaId = await renderCaptcha("captcha")
    runInAction(() => (this.props.resetPasswordStep1Form!.captchaId = captchaId))
  }

  public render() {
    const resetPasswordStep1Form = this.props.resetPasswordStep1Form!
    return (
      <div className="box">
        <form action="#" onSubmit={resetPasswordStep1Form.submit}>
          <div className="is-size-3 has-text-grey-darker has-text-centered">
            Podaj adres email
          </div>
          <hr />
          <Notification message={resetPasswordStep1Form.error} />
          <div className="field">
            <label className="label">Email</label>
            <div className="control has-icons-left">
              <input
                className="input"
                type="email"
                required={true}
                value={resetPasswordStep1Form.data.email}
                onChange={resetPasswordStep1Form.updateField("email")}
              />
              <span className="icon is-small is-left">
                <i className="fa fa-envelope" />
              </span>
            </div>
          </div>
          <div className="field">
            <div className="control">
              <div id="captcha" />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button
                className="button is-link is-fullwidth is-size-4"
                disabled={resetPasswordStep1Form.pending}
              >
                Wyślij
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}
