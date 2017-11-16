import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { runInAction } from "mobx"
import Notification from "components/Notification"
import renderCaptcha from "utils/recaptcha"

interface IRegisterProps {
  registerForm?: IRegisterFormStore
}

@inject("registerForm")
@observer
export default class RegisterForm extends Component<IRegisterProps, {}> {
  public async componentDidMount() {
    this.props.registerForm!.clear()
    const captchaId = await renderCaptcha("captcha")
    runInAction(() => (this.props.registerForm!.captchaId = captchaId))
  }

  public render() {
    const registerForm = this.props.registerForm!
    return (
      <div className="box">
        <form action="#" onSubmit={registerForm.submit}>
          <div className="is-size-3 has-text-grey-darker has-text-centered">
            Rejestracja
          </div>
          <hr />
          <Notification message={registerForm.error} />
          <div className="field">
            <label className="label">Email</label>
            <div className="control has-icons-left">
              <input
                className="input"
                type="email"
                required={true}
                value={registerForm.data.email}
                onChange={registerForm.updateField("email")}
              />
              <span className="icon is-small is-left">
                <i className="fa fa-envelope" />
              </span>
            </div>
          </div>
          <div className="field">
            <label className="label">Imię</label>
            <div className="control">
              <input
                className="input"
                type="text"
                required={true}
                value={registerForm.data.first_name}
                onChange={registerForm.updateField("first_name")}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Nazwisko</label>
            <div className="control">
              <input
                className="input"
                type="text"
                required={true}
                value={registerForm.data.last_name}
                onChange={registerForm.updateField("last_name")}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Hasło</label>
            <div className="control has-icons-left">
              <input
                className={`input ${registerForm.validation.password &&
                  "is-danger"}`}
                type="password"
                required={true}
                value={registerForm.data.password}
                onBlur={registerForm.validatePassword}
                onChange={registerForm.updateField("password")}
              />
              <span className="icon is-small is-left">
                <i className="fa fa-lock" />
              </span>
            </div>
            {registerForm.validation.password && (
              <p className="help is-danger">
                {registerForm.validation.password}
              </p>
            )}
          </div>
          <div className="field">
            <label className="label">Powtórz hasło</label>
            <div className="control has-icons-left">
              <input
                className={`input ${registerForm.validation.confirmPassword &&
                  "is-danger"}`}
                type="password"
                required={true}
                value={registerForm.data.confirmPassword}
                onBlur={registerForm.validatePassword}
                onChange={registerForm.updateField("confirmPassword")}
              />
              <span className="icon is-small is-left">
                <i className="fa fa-lock" />
              </span>
            </div>
            {registerForm.validation.confirmPassword && (
              <p className="help is-danger">
                {registerForm.validation.confirmPassword}
              </p>
            )}
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
                disabled={registerForm.pending}
              >
                Zarejestruj się
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}
